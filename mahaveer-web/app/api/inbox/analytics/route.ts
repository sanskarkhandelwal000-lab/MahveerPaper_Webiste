import { route } from "@/lib/inbox/api";
import { query, queryOne } from "@/lib/inbox/db";

export const GET = route(async ({ req }) => {
  const days = Math.min(Math.max(Number(req.nextUrl.searchParams.get("days")) || 14, 1), 90);
  const totals = await queryOne(
    `select
      (select count(*)::int from contacts) as contacts,
      (select count(*)::int from conversations where status = 'open' and last_message_at is not null) as open_chats,
      (select count(*)::int from conversations where unread_count > 0) as unread_chats,
      (select count(*)::int from conversations where needs_human and status = 'open') as needs_human,
      (select count(*)::int from messages where direction = 'in' and created_at > now() - make_interval(days => $1)) as inbound,
      (select count(*)::int from messages where direction = 'out' and created_at > now() - make_interval(days => $1)) as outbound,
      (select count(*)::int from conversations where status = 'resolved' and last_message_at > now() - make_interval(days => $1)) as resolved`,
    [days],
  );
  const daily = await query(
    `select to_char(d, 'YYYY-MM-DD') as day,
       (select count(*)::int from messages m where m.direction = 'in' and m.created_at >= d and m.created_at < d + interval '1 day') as inbound,
       (select count(*)::int from messages m where m.direction = 'out' and m.created_at >= d and m.created_at < d + interval '1 day') as outbound
     from generate_series(date_trunc('day', now()) - make_interval(days => $1 - 1), date_trunc('day', now()), interval '1 day') d order by d`,
    [days],
  );
  const bySender = await query(
    `select sender_type, count(*)::int as n from messages where direction = 'out' and created_at > now() - make_interval(days => $1) group by 1 order by 2 desc`,
    [days],
  );
  const agents = await query(
    `select u.name, count(m.id)::int as messages, count(distinct m.conversation_id)::int as chats
     from users u join messages m on m.sender_user_id = u.id and m.created_at > now() - make_interval(days => $1)
     group by u.id, u.name order by 2 desc`,
    [days],
  );
  const response = await queryOne<{ avg_sec: number | null; median_sec: number | null }>(
    `with ordered as (
       select conversation_id, created_at, direction, lag(direction) over (partition by conversation_id order by created_at) as prev_dir
       from messages where created_at > now() - make_interval(days => $1) - interval '1 day'
     ), turns as (
       select o.conversation_id, o.created_at as t_in,
         (select min(x.created_at) from messages x where x.conversation_id = o.conversation_id and x.direction = 'out'
            and x.sender_type in ('agent','bot') and x.created_at > o.created_at) as t_out
       from ordered o where o.direction = 'in' and (o.prev_dir is null or o.prev_dir = 'out')
         and o.created_at > now() - make_interval(days => $1)
     )
     select avg(extract(epoch from (t_out - t_in)))::int as avg_sec,
            (percentile_cont(0.5) within group (order by extract(epoch from (t_out - t_in))))::int as median_sec
     from turns where t_out is not null and t_out - t_in < interval '24 hours'`,
    [days],
  );
  const labels = await query(
    `select l.name, l.color, count(cl.conversation_id)::int as n from labels l left join conversation_labels cl on cl.label_id = l.id group by l.id order by n desc limit 6`,
  );
  const campaigns = await queryOne(
    `select count(*)::int as campaigns,
       coalesce(sum(case when r.status in ('sent','delivered','read') then 1 else 0 end),0)::int as sent,
       coalesce(sum(case when r.status in ('delivered','read') then 1 else 0 end),0)::int as delivered,
       coalesce(sum(case when r.status = 'read' then 1 else 0 end),0)::int as read
     from campaigns c left join campaign_recipients r on r.campaign_id = c.id where c.created_at > now() - make_interval(days => $1)`,
    [days],
  );
  return { days, totals, daily, bySender, agents, response, labels, campaigns };
});
