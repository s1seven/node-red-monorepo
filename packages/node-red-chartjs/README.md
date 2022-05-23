This node uses Chart.js v3.7.1 and chartjs-plugin-annotation v1.4.0. It serves `chart.js` and `chartjs-plugin-annotation` to node-red. To use it, use a `node-red-dashboard: ui_template` node and add the following 2 lines:

```html
<script src="/resources/node-red-chartjs/chart.min.js"></script>
<script src="/resources/node-red-chartjs/chartjs-plugin-annotation.min.js"></script>
```

The node has to be installed to the `node-palette`, but the node does not have to be used in a flow. Just installing the node will make the scripts available for use.

Here is an example of the data format that should be passed in as `msg.payload`:

```javascript
{
    "title": "Si",
    "legend": "Si Content",
    "data": [
        {
            "x": 1,
            "y": 0.188
        },
                {
            "x": 2,
            "y": 0.192
        }
    ]
}
```

For more information, check out the Chart.js documentation [here](https://www.chartjs.org/docs/latest/) and the chartjs-plugin-annotation docs [here](https://www.chartjs.org/chartjs-plugin-annotation/latest/).

Here is an example of how to create a chart passing in certificate data as `msg.payload`:
```html
<div>
  <canvas id="myChartScatter" height="1" width="1"></canvas>
</div>
<script>

new Chart(document.getElementById('myChartScatter'), {
    type: 'scatter',
    data: {
        datasets: [{
            label: '{{{payload.legend}}}',
            data: '{{{payload.data}}}',
            showLine: false,
            backgroundColor: 'rgb(255, 99, 132)',
        }],
    },
    options: {
        title: {
            display: true,
            text: '{{{payload.title}}} Content',
        }, 
        
        plugins: {
            autocolors: false,
            annotation: {
                annotations: {
                    minLine: {
                        type: 'line',
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            enabled: true,
                            backgroundColor: 'red',
                            borderColor: 'red',
                            borderRadius: 10,
                            borderWidth: 1,
                            content: 'min',
                            rotation: 'auto'
                        },
                        scaleID: 'y',
                        value: {{{min}}}
                    },
                    maxLine: {
                        type: 'line',
                        borderColor: 'red',
                        borderWidth: 1,
                        label: {
                            enabled: true,
                            backgroundColor: 'red',
                            borderColor: 'red',
                            borderRadius: 10,
                            borderWidth: 1,
                            content: 'max',
                            rotation: 'auto'
                        },
                        scaleID: 'y',
                        value: {{{max}}}
                    },
                }
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                suggestedMax: {{{max}}} * 1.5,
            },
            x: {
                grid: {
                    display: false,
                },
            }
        }
    }
});
</script>
```

We use a `node-red: template` node with the template provided above. The `{{{payload.legend}}}` handlebars format allows you to dynamically pass in information. To customize the type of chart or its properties, refer to the Chart.js documentation linked above.