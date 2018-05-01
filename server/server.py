from bottle import Bottle, request, hook, route, response, run
import pandas as pd
from dataUtils import top_n_crops_produced_at_point, top_n_production_points_for_crop, coordinates

df = None

app = Bottle()

# Load the panda table
def _initialize():
    global df
    df = pd.read_csv('./spam_production_georasters.csv')
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

    top_points = top_n_production_points_for_crop(crop, n, df)
    return {'data': top_points}

@app.route('/top_crops', method=['GET'])
def index():
    x = float(request.query['x'])
    y = float(request.query['y'])
    n = int(request.query['n'])

    top_crops = top_n_crops_produced_at_point(x, y, n, df)
    return {'data': top_crops}

@app.route('/coordinates', method=['GET'])
def index():
    return {'data': coordinates(df)}

if __name__ == "__main__":
    _initialize()
    app.run(host='localhost', port=8080)
