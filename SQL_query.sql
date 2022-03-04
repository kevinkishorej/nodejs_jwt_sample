drop table if exists user_details;

CREATE TABLE public.user_details
(
    _id bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    user_name character varying COLLATE pg_catalog."default",
    user_email character varying COLLATE pg_catalog."default",
    user_password character varying COLLATE pg_catalog."default",
    gender_type character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delete_flag boolean DEFAULT false
);


drop function if exists om_lg_login;

CREATE OR REPLACE FUNCTION public.om_lg_login(
	product__id bigint,
	user__name character varying,
	user__password character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
declare 
z_data json;

	begin
		
		
		select array_to_json( array_agg( row_to_json( user_data ) ))
		from(
		select * from user_details where (lower(user_name) = lower(trim(user__name)) or lower(user_email) = lower(trim(user__name))) and user_password = user__password)
		user_data 
		into z_data;
		
		if z_data is null then

			return to_json('{"error":"Wrong Combination","data":null}'::character varying);
		end if;
		
		   return to_json(concat('{"error":null,"data":',z_data,'}'));

	end
$BODY$;

drop function if exists om_account_creation;

CREATE OR REPLACE FUNCTION public.om_account_creation(
	product__id bigint,
	om_user_name character varying,
	om_user_email character varying,
	om_user_password character varying)
    RETURNS json
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
AS $BODY$
DECLARE
user__id bigint;
BEGIN
	
	
	if om_user_name is null or  length(om_user_name) <= 7 or  length(om_user_name) >= 13 then
			return to_json('{"error":"Invalide User Name","data":null}'::character varying);
	end if;
	if om_user_email is null or om_user_email !~ '^[^@\s]+@[^@\s]+(\.[^@\s]+)+$'   then
			return to_json('{"error":"Invalide User Email","data":null}'::character varying);
	end if;
	if om_user_password is null or length(om_user_password) <= 7 or  length(om_user_password) >= 13  then
			return to_json('{"error":"Invalide Password","data":null}'::character varying);
	end if;
	if EXISTS(select * from user_details where lower(user_name) = lower(om_user_name) )then
			return to_json('{"error":"User Name already Exists","data":null}'::character varying);
	end if;
	
	if EXISTS(select * from user_details where lower(user_email) = lower(om_user_email) )then
			return to_json('{"error":"Email ID already Exists","data":null}'::character varying);

	end if;
	
		insert into user_details(user_name,user_email,user_password)values(om_user_name,om_user_email,om_user_password)returning _id into user__id;
		
		if user__id is null then
				return to_json('{"error":null,"data":false}'::character varying);

		else
				return to_json('{"error":null,"data":"Account have been created "}'::character varying);

		end if;
	postgres
END;
$BODY$;