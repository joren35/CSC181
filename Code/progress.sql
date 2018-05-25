CREATE TABLE "account"
(
    acc_id text NOT NULL,
    username text,
    email text,
    password text,
    first_name text ,
    last_name text,
    specialization text,
    gender text ,
    location text,
    address text,
    phone_number text
);

CREATE TABLE "appointments"
(
  client_name text,
  time_vist TIME,
  date_vist date
);

create or replace function login2(in par_username text, in par_password text) returns text as
$$
  declare
    loc_user text;
    loc_res text;
  begin
     select into loc_user username from account
       where username = par_username and password = par_password;

     if loc_user isnull then
       loc_res = 'Error';
     else
       loc_res = loc_user;
     end if;
     return loc_res;
  end;
$$
LANGUAGE plpgsql;


create or replace function getprofile(in par_location text,out text, out text, out text, out text, out text, out text, out text, out text,out BOOLEAN) returns setof record as
$$
   select username,first_name,last_name,specialization,gender,location,address,phone_number,true from "account" where "username" = par_username;
$$
 language 'sql';

create or replace function edit(in par_username text,in par_email text, in par_first_name text, in par_last_name text,
in par_specialization text, in par_location text, in par_address text, in par_number text ) returns text as
$$
  declare
    loc_res text;
  begin
     UPDATE account
	   SET  email=par_email, first_name=par_first_name, last_name=par_last_name,specialization=par_specialization,location=par_location,address=par_address,phone_number=par_number
	   WHERE username = par_username;

     loc_res = 'ok';
     return loc_res;
  end;
$$
LANGUAGE plpgsql;

create or replace function edit2(in par_username text,in par_email text, in par_first_name text, in par_last_name text,
									in par_address text, in par_number text ) returns text as
$$
  declare
    loc_res text;
  begin
     UPDATE account
	   SET  email=par_email, first_name=par_first_name, last_name=par_last_name,address=par_address,phone_number=par_number
	   WHERE username = par_username;

     loc_res = 'ok';
     return loc_res;
  end;
$$
LANGUAGE plpgsql;

create or replace function searchtherapist(in par_location text,in random text, out text, out text, out text, out text, out text, out text, out text, out text,out BOOLEAN) returns setof record as
$$
   select username,first_name,last_name,specialization,gender,location,address,phone_number,true from "account" where "location" ilike par_location;
$$
 language 'sql';

create or replace function get_profile(in par_username text,in random text, out text, out text, out text, out text, out text, out text, out text, out BOOLEAN) returns setof record as
$$
   select first_name,last_name,specialization,gender,location,address,phone_number,true from "account" where "username" ilike par_username;
$$
 language 'sql';

create or replace function post_appointment(in par_firstname text, in par_lastname text, in par_clientname text, in par_time text, in par_day text, in par_status text, in par_user text) returns text as
$$
  declare
    loc_accID int;
    loc_res text;
    loc_constraint text;

  begin
     select into loc_accID acc_id from account
       where first_name ilike par_firstname and last_name ilike par_lastname;

     if loc_accID isnull then
       loc_res = 'Therapist not found';
     else
       select into loc_constraint acc_id from appointments
       	where loc_accID = acc_id and (visit_time = par_time and visit_date = par_day);

       if loc_constraint isnull then
        	insert into appointments (acc_id,client_name,visit_date,visit_time,appointment_status,the_user)
            values (loc_accID,par_clientname,par_day,par_time,par_status,par_user);
            loc_res = 'ok';
       else
        loc_res = 'Error';
       end if;
     end if;
     return loc_res;
  end;
$$
LANGUAGE plpgsql;

create or replace function get_appointment(in par_firstname text,in par_lastname text, in par_date text, out text,out boolean) returns setof record as
$$
   select visit_time,true from appointments where visit_date=par_date and acc_id =
   (select acc_id from account where first_name ilike par_firstname and last_name ilike par_lastname);
$$
language 'sql';

create or replace function get_myschedtest(in par_currentuser text,in random text,out text, out text,out text, out text,out text) returns setof record as
$$
   select unique_ids::text,visit_time,visit_date,client_name, appointment_status from appointments where acc_id =
   (select acc_id from account where par_currentuser = username);
$$
language 'sql';

create or replace function deletemysched(in par_unique_ids text,in random text) returns void as
$$
  		DELETE FROM appointments
		WHERE unique_ids::text = par_unique_ids
$$
language 'sql';

create or replace function updatemysched(in par_unique_ids text,in random text) returns void as
$$
  		update appointments set appointment_status='accepted' WHERE unique_ids::text = par_unique_ids
$$
language 'sql';

create or replace function updatemysched2(in par_unique_ids text,in random text) returns void as
$$
  		update appointments set appointment_status='declined' WHERE unique_ids::text = par_unique_ids
$$
language 'sql';

create or replace function get_bookings(in par_theuser text,in random text, out text,out text,out text,out text,out text) returns setof record as
$$
  select a.first_name, a.last_name, b.visit_date, b.visit_time, b.appointment_status
	from account a, appointments b
	where a.acc_id=b.acc_id and b.the_user = par_theuser
$$
language 'sql';