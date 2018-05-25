#!flask/bin/python
from flask import Flask, jsonify,request,redirect, url_for
from model import DBconn
import flask
import sys,os

app = Flask(__name__)

logged_user = ''
clicked_user = ''



def spcall(qry, param, commit=False):
    try:
        dbo = DBconn()
        cursor = dbo.getcursor()
        cursor.callproc(qry, param)
        res = cursor.fetchall()
        if commit:
            dbo.dbcommit()
        return res
    except:
        res = [("Error: " + str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1]),)]
    return res

@app.route('/')
def index():
    return redirect(url_for('index'))

@app.route('/login', methods=['POST'])
def signIn():
    global logged_user
    params = request.get_json()
    password = params["password"]
    username = params["username"]
    res = spcall('login2', (username, password), True)

    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})
    else:
        logged_user = res[0][0]
        res1 = spcall('logintest', (logged_user,'random'), True)
        if 'therapist' in res1[0][0]:
            return jsonify({'status': 'ok', 'message': 'therapist'})
        else:
            return jsonify({'status': 'ok', 'message': 'client'})



@app.route('/edit', methods=['POST','GET'])
def edit():
    params = request.get_json()
    email = params["email"]
    specialization = params["specialization"]
    last_name = params["lastName"]
    first_name = params["firstName"]
    location = params["location"]
    address = params["address"]
    phone_number = params["phoneNumber"]
    res = spcall('edit', (logged_user, email, first_name, last_name,specialization, location, address, phone_number), True)

    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})
    else:
        return jsonify({'status': 'ok', 'message': res[0][0]})


@app.route('/edit2', methods=['POST','GET'])
def edit2():
    params = request.get_json()
    email = params["email"]
    last_name = params["lastName"]
    first_name = params["firstName"]
    address = params["address"]
    phone_number = params["phoneNumber"]
    res = spcall('edit2', (logged_user, email, first_name, last_name, address, phone_number), True)

    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})
    else:
        return jsonify({'status': 'ok', 'message': res[0][0]})



@app.route('/search', methods=['GET','POST'])
def search():
    params = request.get_json()
    location1 = params["location1"]
    res = spcall("searchtherapist1", (location1,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"username1": r[0],"first_name": r[1], "last_name": r[2], "specialization1": r[3], "gender": r[4],
                     "location1": r[5], "address1": r[6], "phone_number": r[7]})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})

@app.route('/profile', methods=['GET','POST'])
def profile():

    res = spcall("getprofile", (logged_user,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"first_name": r[0], "last_name": r[1], "specialization": r[2], "gender": r[3],
                     "location": r[4], "address": r[5], "phone_number": r[6] ,"done": str(r[7])})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})

@app.route('/getprofile', methods=['GET','POST'])
def get_profile():
    global clicked_user

    res = spcall("get_profile", (clicked_user,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"first_name": r[0], "last_name": r[1], "specialization1": r[2], "gender": r[3],
                     "location1": r[4], "address": r[5], "phone_number": r[6] ,"done": str(r[7])})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})

@app.route('/addsched', methods=['POST','GET'])
def add_sched():
    global logged_user
    params = request.get_json()
    first_name = params["first_name"]
    last_name = params["last_name"]
    client_name = params["client_name"]
    date_sched = params["date_sched"]
    time_sched = params["time_sched"]
    default_status = 'pending'

    res = spcall('post_appointment', (first_name, last_name, client_name, time_sched, date_sched,default_status,logged_user), True)

    if 'Error' in res[0][0]:
        return jsonify({'status': 'error', 'message': res[0][0]})
    elif 'Therapist not found' in res[0][0]:
        return jsonify({'status': 'not found', 'message': res[0][0]})
    else:
        return jsonify({'status': 'ok', 'message': res[0][0]})


@app.route('/clickeduser/<string:clickeduser>', methods=['GET','POST'])
def clickeduser(clickeduser):
    global clicked_user
    clicked_user = clickeduser
    return jsonify({'status': 'ok'})

@app.route('/getsched', methods=['GET','POST'])
def get_sched():

    params = request.get_json()
    first_name = params["first_name"]
    last_name = params["last_name"]
    date_sched = params["date_sched"]

    res = spcall("get_appointment", (first_name,last_name,date_sched), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"schedule": r[0], "done1": str(r[1])})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.route('/viewsched', methods=['GET','POST'])
def view_sched():

    global logged_user

    res = spcall("get_myschedtest1", (logged_user,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"unique_ids":r[0] ,"visit_time": r[1], "visit_date": r[2], "client_name": r[3],"current_status": r[4]})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.route('/viewbooked', methods=['GET','POST'])
def view_booked():

    global logged_user

    res = spcall("get_bookings", (logged_user,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    recs = []

    for r in res:
        recs.append({"first_name":r[0] ,"last_name": r[1], "date_visit": r[2], "time_visit": r[3],"current_status": r[4], "unique_ids": r[5]})
    return jsonify({'status': 'ok', 'entries': recs, 'count': len(recs)})


@app.route('/deleteThis/<string:theID>/', methods=['DELETE','POST', 'GET'])
def delete_sched(theID):

    res = spcall("deletemysched", (theID,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    return jsonify({'status': 'ok'})

@app.route('/updateThis/<string:theID>/', methods=['DELETE','POST', 'GET'])
def update_sched(theID):

    res = spcall("updatemysched", (theID,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    return jsonify({'status': 'ok'})

@app.route('/updateThis2/<string:theID>/', methods=['DELETE','POST', 'GET'])
def update_sched2(theID):

    res = spcall("updatemysched2", (theID,'random'), True)

    if 'Error' in str(res[0][0]):
        return jsonify({'status': 'error', 'message': res[0][0]})

    return jsonify({'status': 'ok'})

@app.after_request
def add_cors(resp):
    resp.headers['Access-Control-Allow-Origin'] = flask.request.headers.get('Origin', '*')
    resp.headers['Access-Control-Allow-Credentials'] = True
    resp.headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS, GET, PUT, DELETE'
    resp.headers['Access-Control-Allow-Headers'] = flask.request.headers.get('Access-Control-Request-Headers',
                                                                             'Authorization')
    # set low for debugging

    if app.debug:
        resp.headers["Access-Control-Max-Age"] = '1'
    return resp


if __name__ == '__main__':
    app.run(threaded=True,debug=True)
