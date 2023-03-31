import eel

eel.init('web')

@eel.expose
def readCSV():
    csv = open('./dados.csv').readlines()
    data = []
    for line in csv[1:]:
        if line.strip() != ';;;;;;':
            values = line.strip().split(';')
            data.append({
                'id': len(data) + 2,
                'name': values[0] + ' - ' + values[1],
                'resource': values[2],
                'start': values[3],
                'end': values[4],
                'percentage': values[5],
                'dependencies': values[6] 
            })
    return data
    
    
eel.start('index.html')