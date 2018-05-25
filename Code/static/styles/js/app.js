 $("#button2").click(function(){
            $("#applybooking").slideToggle('slow');
        });
         $("#button1").click(function(){
            $("#viewbooking").slideToggle('slow');
        });

         $("#button3").click(function(){
            $("#displaybuttons").show();
        });

function login() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/login",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'username': $("#username").val(),
                'password': $("#password").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status == 'ok') {
                    if(resp.message == 'therapist'){
                        window.location.replace('Options.html')
                    }
                    else{
                        window.location.replace('Options2.html')
                    }
                }
                else {
                   window.location.replace('index.html?username='+resp.message+'/')
                }

            }
    });
}

function profile() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/profile",
            contentType: 'application/json; charset=utf-8',
            type: "GET",
            dataType: "json",

            success: function (resp) {
                if (resp.status == 'ok') {
                    for (i=0; i<resp.count;i++)
                    {
                        first_name = resp.entries[i].first_name;
                        $("#testname").html(display(first_name));
                    }
                }
                else {

                }

            }
    });
}

function edit() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/edit",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'email': $("#email").val(),
                'firstName': $("#firstName").val(),
                'lastName': $("#lastName").val(),
                'specialization': $("#specialization").val(),
                'location': $("#location").val(),
                'address': $("#address").val(),
                'phoneNumber': $("#phoneNumber").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status == 'ok') {
                    alert('Successfuly Updated')
                }
                else {
                   window.location.replace('edit.html?username='+resp.message+'/')
                }

            }
    });
}

function edit2() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/edit2",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'email': $("#email").val(),
                'firstName': $("#firstName").val(),
                'lastName': $("#lastName").val(),
                'address': $("#address").val(),
                'phoneNumber': $("#phoneNumber").val()
            }),
            type: "POST",
            dataType: "json",
            error: function (e) {
            },
            success: function (resp) {
                if (resp.status == 'ok') {
                    alert('Successfuly Updated')
                }
                else {
                   window.location.replace('edit.html?username='+resp.message+'/')
                }

            }
    });
}

function search(){
        $('#test1').show();
    $.ajax({
    		url: "http://127.0.0.1:5000/search",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'location1': $("#location1").val()
            }),
            type:"POST",
    		dataType: "json",
            error: function (e) {
            },
    		success: function(resp) {

				if (resp.status  == 'ok') {
				   for (i = 0; i < resp.count; i++)
                                  {
                                       username1 = resp.entries[i].username1;
									   first_name = resp.entries[i].first_name;
									   last_name = resp.entries[i].last_name;
									   specialization1 = resp.entries[i].specialization1;
                                       gender = resp.entries[i].gender;
                                       location1 = resp.entries[i].location1;
                                       address1 = resp.entries[i].address1;
                                       phone_number = resp.entries[i].phone_number;
                                       $("#test1").append(showSearched(username1,first_name,last_name,specialization1,gender,location1,address1,phone_number));
                                  }
				} else
				{
                                       $("#test1").html("");
					alert(resp.message);
				}
    		}
		});
}

function get_profile(username) {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/clickeduser/"+username+"",
            type: "POST",
            error: function (e) {
            },
    		success: function(resp) {
                if (resp.status  == 'ok'){}
            }

    });
}

function loadClicked() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/getprofile",
            contentType: 'application/json; charset=utf-8',
            type: "GET",
            dataType: "json",
            error: function (e) {
            },
    		success: function(resp) {
               if (resp.status == 'ok') {
                    for (i=0; i<resp.count;i++)
                    {
                        first_name = resp.entries[i].first_name;
                        last_name = resp.entries[i].last_name;
                        specialization1 = resp.entries[i].specialization1;
                        gender = resp.entries[i].gender;
                        $("#profileHere").html(display_profile(first_name,last_name,specialization1,gender));
                    }
                }
            }

    });
}

function post_sched() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/addsched",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'first_name': $("#firstname").val(),
                'last_name': $("#lastname").val(),
                'client_name': $("#clientname").val(),
                'date_sched': $("#scheddate").val(),
                'time_sched': $('input[name="optradio"]:checked').val()
            }),
            type:"POST",
    		dataType: "json",
            error: function (e) {
                alert('error');
            },
    		success: function(resp) {
               if (resp.status == 'ok') {
                   alert('It has been added');
                }
               else if (resp.status == 'not found'){
                   alert('Therapist not Found');
                }
               else {
                   alert('Slot have been taken');
                }
            }

    });
}

function viewmysched() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/viewsched",
            contentType: 'application/json; charset=utf-8',
            type: "GET",
            dataType: "json",

            success: function (resp) {
                if (resp.status == 'ok') {
                    for (i=0; i<resp.count;i++)
                    {
                        if (resp.entries[i].current_status == 'pending') {
                            unique_ids = resp.entries[i].unique_ids;
                            visit_time = resp.entries[i].visit_time;
                            visit_date = resp.entries[i].visit_date;
                            client_name = resp.entries[i].client_name;
                            $("#displayid").append(displaythis(unique_ids, visit_time, visit_date, client_name));
                        }
                        else if(resp.entries[i].current_status == 'accepted'){
                            unique_ids = resp.entries[i].unique_ids;
                            visit_time = resp.entries[i].visit_time;
                            visit_date = resp.entries[i].visit_date;
                            client_name = resp.entries[i].client_name;
                            $("#displayaccepted").append(displaythis2(unique_ids, visit_time, visit_date, client_name));

                        }
                    }
                }
                else {

                }

            }
    });
}

function viewbooked() {
 $.ajax
    ({
            url: "http://127.0.0.1:5000/viewbooked",
            contentType: 'application/json; charset=utf-8',
            type: "GET",
            dataType: "json",

            success: function (resp) {
                if (resp.status == 'ok') {
                    for (i=0; i<resp.count;i++)
                    {
                       first_name = resp.entries[i].first_name;
                       last_name = resp.entries[i].last_name;
                       date_visit = resp.entries[i].date_visit;
                       time_visit = resp.entries[i].time_visit;
                       current_status = resp.entries[i].current_status;
                       unique_ids = resp.entries[i].unique_ids;
                       $("#displayid").append(displaythis3(first_name, last_name, date_visit, time_visit,current_status,unique_ids));
                    }
                }
                else {

                }

            }
    });
}


function get_sched() {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/getsched",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                'first_name': $("#booking_firstname").val(),
                'last_name': $("#booking_lastname").val(),
                'date_sched': $("#booking_date").val()
            }),
            type:"POST",
    		dataType: "json",
            error: function (e) {
                alert('No Booked Schedule yet');
            },
    		success: function(resp) {
               if (resp.status == 'ok') {
                   for (i = 0; i < resp.count; i++) {
                       day_sched = resp.entries[i].schedule;
                       finished = resp.entries[i].done1;
                       $("#schedhere").append(daily_sched(day_sched));
                   }
               }
               else {
                   alert('No records found');
                }
            }

    });
}

function deleteThis(theID) {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/deleteThis/"+theID+"/",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: "json",

            error: function (e) {
                alert('OMG ERROR! >.<');
            },

            success: function (resp) {
                if (resp.status == 'ok') {
                    dualPurpose2();

                }
                else {

                }

            }
    });
}

function deleteThis2(theID) {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/deleteThis/"+theID+"/",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: "json",

            error: function (e) {
                alert('OMG ERROR! >.<');
            },

            success: function (resp) {
                if (resp.status == 'ok') {
                    dualPurpose3();

                }
                else {

                }

            }
    });
}


function updateThis(theID) {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/updateThis/"+theID+"/",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: "json",

            error: function (e) {
                alert('OMG ERROR! >.<');
            },

            success: function (resp) {
                if (resp.status == 'ok') {
                    dualPurpose2();

                }
                else {

                }

            }
    });
}


function updateThis2(theID) {
    $.ajax
    ({
            url: "http://127.0.0.1:5000/updateThis2/"+theID+"/",
            contentType: 'application/json; charset=utf-8',
            type: "POST",
            dataType: "json",

            error: function (e) {
                alert('OMG ERROR! >.<');
            },

            success: function (resp) {
                if (resp.status == 'ok') {
                    dualPurpose2();

                }
                else {

                }

            }
    });
}

function daily_sched(schedule)
{
    return '<tr>' +
        '<td>' +schedule+ '</td>' +
        '</tr>';
}

function showSearched(username1,first_name,last_name,specialization,gender,location1,address,phone_number)
{
   return '<tr>'+
        '<td>' +first_name+ ' '+ last_name+  '</td>'+
       '<td>' +specialization+ '</td>'+
	   '<td>' +gender+ '</td>'+
       '<td>' +location1+ '</td>'+
	   '<td>' +address+'</td>'+
       '<td>' +phone_number+'</td>'+
       '</tr>';
}

function display(first_name)
{
   return '<h1 class="name" id="name1"> Welcome to Therapist Finder <span style="color:brown">' +first_name+'</span></h1>'+
                            '<hr class="star-light">'+
                            '<span class="skills">Find therapist in your area!</span>'

}
function display_profile(first_name,last_name,specialization,gender)
{
    return '<h3>'+first_name+''+last_name+'</h3>'+
            '<h6>'+specialization+'</h6>'+
            '<h6>'+gender+'</h6>'

}

function dualPurpose()
{
    clearTable();
    search();
}

function dualPurpose1()
{
    clearTable1();
    get_sched();
}

function dualPurpose2()
{
    clearTable2();
    clearTable3();
    viewmysched();
}
function dualPurpose3()
{
    clearTable4();
    viewbooked();

}


function clearTable()
{
    $("table.testing").html( "<tr>\n" +
        "                                <th>Name</th>\n" +
        "                                <th>Specialization</th>\n" +
        "                                <th>Gender</th>\n" +
        "                                <th>Location</th>\n" +
        "                                <th>Address</th>\n" +
        "                                <th>Telephone</th>\n" +
        "                              </tr>" )
}

function clearTable1()
{
    $("div.testing1").html( "<tr>\n" +
        "                                <th>Booked Schedule</th>\n" +
        "                              </tr>" )
}

function clearTable2()
{
    $("table.responstable").html("              <tr>\n" +
        "                <th>Time</th>\n" +
        "                <th>Visitation Date (Year / Month / Day)</th>\n" +
        "                <th>Client name</th>\n" +
        "                <th>Accept</th>\n" +
        "                <th>Decline</th>\n" +
        "              </tr>")
}

function clearTable3()
{
    $("#displayaccepted").html("              <tr>\n" +
        "                <th>Time</th>\n" +
        "                <th>Visitation Date (Year / Month / Day)</th>\n" +
        "                <th>Client name</th>\n" +
        "                <th>Delete</th>\n" +
        "              </tr>")
}


function clearTable4()
{
    $("#displayid").html("              <tr>\n" +
        "                <th>Therapist Name</th>\n" +
        "                <th>Visitation Date (Year / Month / Day)</th>\n" +
        "                <th>Time</th>\n" +
        "                <th>Status</th>\n" +
        "                <th>Cancel/Delete</th>\n" +
        "              </tr>")
}



function displaythis(sched_id,visit_time,visit_date,client_name)
{
    return '<tr xmlns="http://www.w3.org/1999/html">'+
    '<td>'+visit_time+'</td>'+
    '<td>'+visit_date+'</td>'+
    '<td>'+client_name+'</td>'+
    '<td><button data-title="Accept" class="btn btn-success btn-xs glyphicon glyphicon-ok" type="button" onclick="updateThis(\'' + sched_id + '\');"/></td>'+
    '<td><button data-title="Delete" class="btn btn-danger btn-xs glyphicon glyphicon-remove" type="button" onclick="updateThis2(\'' + sched_id + '\');"/></td>'+
  '</tr>'
}

function displaythis2(sched_id,visit_time,visit_date,client_name)
{
    return '<tr xmlns="http://www.w3.org/1999/html">'+
    '<td>'+visit_time+'</td>'+
    '<td>'+visit_date+'</td>'+
    '<td>'+client_name+'</td>'+
    '<td><button data-title="Delete" class="btn btn-danger btn-xs glyphicon glyphicon-trash" type="button" onclick="deleteThis(\'' + sched_id + '\');"/></td>'+
  '</tr>'
}

function displaythis3(first_name,last_name,visit_date,visit_time,sched_status,sched_id)
{
    return '<tr>'+
        '<td>' +first_name+ ' '+ last_name+  '</td>'+
	   '<td>' +visit_date+'</td>'+
       '<td>' +visit_time+'</td>'+
       '<td>' +sched_status+'</td>'+
    '<td><button data-title="Delete" class="btn btn-danger btn-xs glyphicon glyphicon-trash" type="button" onclick="deleteThis2(\'' + sched_id + '\');"/></td>'+
  '</tr>';
}
