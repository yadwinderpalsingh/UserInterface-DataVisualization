var gender = ["Male", "Female"];
        var rawData ;
        var ageGroups;
        var years = [];

        $(document).ready(function() {
            rawData = readData();
        });
        var chart;
        
        var options = {
            chart: {
                type: 'column',
                options3d: {
                    enabled: true,
                    alpha: 15,
                    beta: 15,
                    viewDistance: 25,
                    depth: 40,
                }
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Age'
                }
            },
            tooltip: {
                headerFormat: '<b>{point.key}</b><br>',
                pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: {point.y} / {point.stackTotal}'
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    depth: 40
                }
            }, 
            series: []
        };
        
        function readData(){
            $.get('population.csv', function (data) {
                rawData = data;
                readAgeGroups();
                getYears();
                formatData(1860);
                var yearSlider = new Slider("#yearslider", {
                    ticks: years,
                    ticks_labels: years,
                    min: 1,
                    max: 15,
                    step: years[1] - years[0],
                    value: years[0]
                });    
                yearSlider.on('change', function(){
                    formatData(yearSlider.getValue());
                });
            });
        }
        
        //read age groups
        function readAgeGroups() {
            var ageGroups = [];
            
            // Split the lines
            var lines = rawData.split('\n');

            $.each(lines, function (lineNo, line) {
                var items = line.split(',');

                if (lineNo > 0) {
                    // age groups
                    if (ageGroups.length < 19) {
                        if (ageGroups.length == 0) {
                            ageGroups.push(parseInt(items[1]));
                        } else {
                            if (ageGroups[ageGroups.length - 1] !== parseInt(items[1])) {
                                ageGroups.push(parseInt(items[1]));
                            }
                        }
                    }                
                }
                
            });              
            options.xAxis.categories = ageGroups;
            
        }
        
        function getYears() {
            var lines = rawData.split('\n');
            $.each(lines, function (lineNo, line) {
                    var items = line.split(',');

                    // header line containes categories
                    if (lineNo > 0) {
                        //added years in an array
                        if(years.length == 0) {
                            years.push(parseInt(items[0]));
                        } else {
                            if (years[years.length-1] !== parseInt(items[0]) ) {
                                years.push(parseInt(items[0]));
                            }
                        }

                }});

            
        }
        
        function formatData(year){
            var lines = rawData.split('\n');

                var maleobj = {
                    name: "Male"
                    , data: []
                    , stack: "male"
                };

                var femaleobj = {
                    name: "Female"
                    , data: []
                    , stack: "female"
                };

                $.each(lines, function (lineNo, line) {
                    var items = line.split(',');

                    // header line containes categories
                    if (lineNo > 0) {
                        // data by selected year
                        if (parseInt(items[0]) === year && items[2] === gender[0]) {
                            maleobj.data.push(parseInt(items[3]));
                        } else if (parseInt(items[0]) === year) {
                            femaleobj.data.push(parseInt(items[3]));
                        }                   
                    }

                });

                
                
                if (options.series.length > 0) {
                    options.series.splice($.inArray(options.series[0], options.series),1);
                    options.series.splice($.inArray(options.series[0], options.series),1);
                    options.series.push(maleobj);
                    options.series.push(femaleobj);
                    $('#container').highcharts(options);
                } else {
                    options.series.push(maleobj);
                    options.series.push(femaleobj);
                    $('#container').highcharts(options);
                }
            chart = $('#container').highcharts();
        }


    // Activate the sliders
    $('.sliders input').on('input change', function () {
        var dataChart = $('#container').highcharts();
        dataChart.options.chart.options3d[this.id] = this.value;
        chart.redraw(false);
    });