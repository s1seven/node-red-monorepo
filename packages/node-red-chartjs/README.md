# new-node-red-example

This node serves `chart.js` and `chartjs-plugin-annotation` to node-red. To use it, use a `node-red-dashboard: ui_template` node and add the following 2 lines:

```html
<script src="/resources/node-red-chartjs/chart.min.js"></script>
<script src="/resources/node-red-chartjs/chartjs-plugin-annotation.min.js"></script>
```

The node has to be installed to the `node-palette`, but the node does not have to be used in a flow. Just installing the node will make the scripts available for use.

Here is an example of the data that should be passed in as `msg.payload`:

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
