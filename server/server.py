from bottle import Bottle, request, hook, route, response, run
import pandas as pd
from dataUtils import top_n_crops_produced_at_point, top_n_production_points_for_crop, coordinates, interesting_points

actual = None
predicted = None

app = Bottle()

# Load the panda table
def _initialize():
    global actual
    global predicted

    actual = pd.read_csv('../data/actual_production.csv')
    predicted = pd.read_csv('../data/predicted_production.csv')

    return

@app.hook('after_request')
def enable_cors():
    '''Add headers to enable CORS'''
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'PUT, GET, POST, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Authorization, Origin, Accept, Content-Type, X-Requested-With'

@app.route('/top_points', method=['GET'])
def index():
    crop = request.query['crop']
    n = int(request.query['n'])
    table = request.query['table']

    if (table == 'predicted'):
        table = predicted
    elif (table == 'actual'):
        table = actual
    elif (table == 'interesting'):
        table = interesting_points(crop, n, actual, predicted)

    top_points = top_n_production_points_for_crop(crop, n, table)

    return {'data': top_points}

@app.route('/top_crops', method=['GET'])
def index():
    x = float(request.query['x'])
    y = float(request.query['y'])
    n = int(request.query['n'])

    top_crops_actual = top_n_crops_produced_at_point(x, y, n, actual)
    top_crops_predicted = top_n_crops_produced_at_point(x, y, n, predicted)

    return {'data': {'actual': top_crops_actual, 'predicted': top_crops_predicted}};

@app.route('/coordinates/all', method=['GET'])
def index():
    return {'data': coordinates(actual)}


if __name__ == "__main__":
    _initialize()
    app.run(host='localhost', port=8080)
