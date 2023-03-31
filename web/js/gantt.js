google.charts.load('current', { 'packages': ['gantt'] });
console.log(eel)
eel.readCSV()(function (csv) {
    const resources = document.getElementById('resources');
    const resList = csv.map(e => e.resource)
        .filter((element, index, arr) => index === arr.indexOf(element));
    resources.innerHTML = resList.map(e => `<input type="checkbox" id="${e}" checked><label>${e}</label>`).join("");
    google.charts.setOnLoadCallback(drawChart(csv));
})

function dateFromCSV(date) {
    const v = date.split('/')
    return new Date(v[2], v[1] - 1, v[0])

}

function refresh() {
    eel.readCSV()(function (csv) {
        google.charts.setOnLoadCallback(drawChart(csv));
    })
}
function drawChart(csv) {
    console.log(csv)
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Task ID');
    data.addColumn('string', 'Task Name');
    data.addColumn('string', 'Resource');
    data.addColumn('date', 'Start Date');
    data.addColumn('date', 'End Date');
    data.addColumn('number', 'Duration');
    data.addColumn('number', 'Percent Complete');
    data.addColumn('string', 'Dependencies')
    data.addColumn('string', 'Obs')

    let ganttData = csv.map(e => {
        const out = []
        const end = dateFromCSV(e.end)
        const start = dateFromCSV(e.start)

        out.push(e.id.toString());
        out.push(e.name);
        out.push(e.resource);
        out.push(start)
        out.push(end)
        out.push(null)
        out.push(parseInt(e.percentage))
        out.push(e.dependencies)
        out.push(e.obs)
        return out;
    })
    if (document.getElementById('date').value) {
        const date = new Date(document.getElementById('date').value);
        ganttData = ganttData
            .filter(e => {
                const dateTest = e[4].getTime() >= date.getTime()
                const resourceTest = document.getElementById(e[2]).checked;
                return dateTest && resourceTest;
            })

    } else {
        ganttData = ganttData
            .filter(e => {
                const resourceTest = document.getElementById(e[2]).checked;
                return resourceTest;
            })
    }
    data.addRows(ganttData.map(e => {
        if (e[7] === '') {
            e[7] = null;
            return e;
        } else {
            const dep = e[7].split(',')
                .filter(d => ganttData.find(element => element[0] === d))

            console.log(ganttData)
            console.log(dep)

            e[7] = dep.join(',');
            return e;
        }
    }))
    var options = {
        height: 35 * ganttData.length + 50,
        gantt: {
            trackHeight: 30,
            arrow: {
                angle: 90,
                radius: 0
              }
        }
    };

    var chart = new google.visualization.Gantt(document.getElementById('chart_div'));
    chart.draw(data, options);
}