var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'COVID-19-stats',
    // App id
    id: 'io.github.covid-19-stats',
    // Enable swipe panel
    panel: {
        swipe: 'left',
    },
    // Add default routes
    routes: [{
        path: '/about/',
        url: './views/about.html',
    }, {
        path: '/timeline/',
        url: './views/timeline.html'
    }, {
        path: '/search/',
        url: './views/search.html'
    }],
    // ... other parameters
});
var mainView = app.views.create('.view-main');

// dom
var $$ = Dom7;

app.preloader.show();
let url = `https://api.covid19api.com/summary`;
app.request.get(url, function(res) {
    res = JSON.parse(res);
    app.preloader.hide();

    const global = res.Global;
    const local = res.Countries
    console.log({ local })
    $$('#countries .list ul').html('');
    for (let i = 0; i < local.length; i++) {
        $$('#countries .list ul').append(`
            <li>
                <div class="item-content">
                    <div class="item-media">
                        <span class="flag-icon flag-icon-${local[i].CountryCode.toLowerCase()}"></span>
                    </div>
                    <div class="item-inner">
                        <div class="item-title">${local[i].Country}</div>
                        <div class="item-after">${local[i].CountryCode}</div>
                    </div>
                </div>
            </li>
        `);
    }

    $$('.list li').on('click', function() {

        let country = $$(this).find('.item-title').text();
        console.log({ country, local })
        const countryData = local.filter((val) => val.Country === country)[0];

        console.log({ countryData })
            // Create dynamic Sheet
        var dynamicSheet = app.sheet.create({
            content: `<div class="sheet-modal">
                <div class="toolbar">
                    <div class="toolbar-inner bg-color-green">
                    <div class="left"></div>
                        <div class="right">
                        <a class="link sheet-close ">Close</a>
                        </div>
                    </div>
                    </div>
                    <div class="sheet-modal-inner" style='overflow: scroll'>
                    <div class="block" >
                        <h5>Cases Overview : ${new Date(countryData.Date)}</h5>
                        <h1><span class="flag-icon flag-icon-${countryData.CountryCode.toLowerCase()}" style="font-size:1em"></span> ${countryData.Country} : ${countryData.CountryCode}</h1>
                        
                            <div class='row'>
                                <div class='col-33'>
                                    <h5>Confirmed Cases</h5>
                                    <h1>${countryData.TotalConfirmed}</h1>
                                </div>
                                
                                <div class='col-33'>
                                    <h5>Recovered Cases</h5>
                                    <h1>${countryData.TotalRecovered}</h1>
                                </div>
                                
                                <div class='col-33'>
                                    <h5>Deaths</h5>
                                    <h1>${countryData.TotalDeaths}</h1>
                                </div>
                        </div>
                        <h1>Globally</h1>
                        <div class='row'>
                                <div class='col-33'>
                                    <h5>Confirmed Cases</h5>
                                    <h1>${global.TotalConfirmed}</h1>
                                </div>
                                
                                <div class='col-33'>
                                    <h5>Recovered Cases</h5>
                                    <h1>${global.TotalRecovered}</h1>
                                </div>
                                
                                <div class='col-33'>
                                    <h5>Deaths</h5>
                                    <h1>${global.TotalDeaths}</h1>
                                </div>
                        </div>

                    </div>
                    </div>
                    </div>`,
            // Events
            on: {
                open: function(sheet) {
                    //console.log('Sheet open');
                },
                opened: function(sheet) {
                    //console.log('Sheet opened');
                    app.preloader.hide();
                },
            }
        });
        // Events also can be assigned on instance later
        dynamicSheet.on('close', function(sheet) {
            //console.log('Sheet close');
        });
        dynamicSheet.on('closed', function(sheet) {
            //console.log('Sheet closed');
        });

        // Open dynamic sheet

        // Close inline sheet before
        app.sheet.close('.my-sheet');

        // Open dynamic sheet
        dynamicSheet.open();

    });
});



/*
$$('.list li').on('click', function() {
    app.preloader.show();

    let country = $$(this).find('.item-title').text();

    let url = `https://corona-virus-stats.herokuapp.com/api/v1/cases/countries-search?search=${country}`
    app.request.get(url, function(res) {
        res = JSON.parse(res);

        let val = res.data.rows[0];

        if (res.data.rows.length == 0) {

            app.dialog.alert(`No data available`, `Covid-19 report for ${val.country}`)
            return;
        }

        // Create dynamic Sheet
        var dynamicSheet = app.sheet.create({
            content: `<div class="sheet-modal">
                <div class="toolbar">
                    <div class="toolbar-inner bg-color-green">
                    <div class="left"></div>
                        <div class="right">
                        <a class="link sheet-close ">Close</a>
                        </div>
                    </div>
                    </div>
                    <div class="sheet-modal-inner" style='overflow: scroll'>
                    <div class="block" >
                        <h5>Cases Overview : ${res.data.last_update}</h5>
                        <h1><img src="${val.flag}" height="25vh" > ${val.country} : ${val.country_abbreviation}</h1>
                        
                            <div class='row'>
                                <div class='col-33'>
                                <h5>Confirmed Cases</h5>
                                <h1>${val.total_cases}</h1>
                            </div>
                            
                            <div class='col-33'>
                                <h5>Recovered Cases</h5>
                                <h1>${val.total_recovered}</h1>
                            </div>
                            
                            <div class='col-33'>
                                <h5>Deaths</h5>
                                <h1>${val.total_deaths}</h1>
                            </div>
                            
                        
                        </div>

                    </div>
                    </div>
                    </div>`,
            // Events
            on: {
                open: function(sheet) {
                    //console.log('Sheet open');
                },
                opened: function(sheet) {
                    //console.log('Sheet opened');
                    app.preloader.hide();
                },
            }
        });
        // Events also can be assigned on instance later
        dynamicSheet.on('close', function(sheet) {
            //console.log('Sheet close');
        });
        dynamicSheet.on('closed', function(sheet) {
            //console.log('Sheet closed');
        });

        // Open dynamic sheet

        // Close inline sheet before
        app.sheet.close('.my-sheet');

        // Open dynamic sheet
        dynamicSheet.open();

    })

})
*/
