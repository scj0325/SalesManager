create trigger trigger_set_reply_id
before insert on comments_reply
for each row
execute function set_reply_id_before_insert();