import { route } from "@/lib/inbox/api";
import { query } from "@/lib/inbox/db";

export const GET = route(async () => ({
  samples: await query(
    `select s.id, s.product_id, s.product_name, s.status, s.created_at, s.name, s.email, s.location, s.wa_id, s.contact_id,
       v.id as conversation_id, coalesce(c.name, c.profile_name, '+' || s.wa_id) as contact_name
     from sample_requests s left join contacts c on c.id = s.contact_id left join conversations v on v.contact_id = c.id
     order by s.created_at desc limit 500`,
  ),
}));
