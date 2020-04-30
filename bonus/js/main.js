/**
 * BONUS OPZIONALE:
Trasformare la lista precedente in 
un vero e proprio calendario, generando una griglia che segua l’andamento dei giorni 
di un mese a scelta, evidenziando le festività.`
Creare dei bottoni che permettano di spostarsi di mese in mese, 
rigenerando ogni volta la griglia e le festività associate
*/

$(document).ready(function () {

    /**
     * SETUP
     */

    // Punto di partenza
    var baseMonth = moment('2018-01-01');

    // Init Hndlenars
    var source = $('#day-template').html();
    var template = Handlebars.compile(source);

    // print giorno
    printMonth(template, baseMonth);

    // ottieni festività mese corrente
    printHoliday(baseMonth);

    $('.next').click(function () {

        if ($('.month').attr('data-this-date') != '2018-12-01') {

            // setto variabile con il mese successivo
            var nextMonth = baseMonth.add(1, 'M');

            // reset dati nel DOM
            $('.month-list').html('');
            $('.main-side .day-holiday').html('')

            // Genero nuovi parametri e li printo nel DOM
            printMonth(template, nextMonth)
            printHoliday(nextMonth)
        }
    });

    $('.prev').click(function () {

        if ($('.month').attr('data-this-date') != '2018-01-01') {

            // setto variabile con il mese precedente
            var prevMonth = baseMonth.subtract(1, 'M');

            // reset dati nel DOM
            $('.month-list').html('');
            $('.main-side .day-holiday').html('')

            // Genero nuovi parametri e li printo nel DOM
            printMonth(template, prevMonth)
            printHoliday(prevMonth)
        }

    });

}); // <-- End doc ready


/*************************************
FUNCTIONS
*************************************/

// Stampa a schermo i giorni del mese
function printMonth(template, date) {
    // numero giorni nel mese
    var daysInMonth = date.daysInMonth();

    //  setta header
    $('h1').html(date.format('MMMM YYYY'));

    // Imposta data attribute data visualizzata
    $('.month').attr('data-this-date', date.format('YYYY-MM-DD'));

    // genera giorni mese
    for (var i = 0; i < daysInMonth; i++) {
        // genera data con moment js
        var thisDate = moment({
            year: date.year(),
            month: date.month(),
            day: i + 1
        });

        // imposta dati template
        var context = {
            class: 'day',
            day: thisDate.format('DD MMMM'),
            completeDate: thisDate.format('YYYY-MM-DD')
        };

        //compilare e aggiungere template
        var html = template(context);
        $('.month-list').append(html);
    }
}

// Ottieni e stampa festività
function printHoliday(date) {
    // chiamo API
    $.ajax({
        url: 'https://flynn.boolean.careers/exercises/api/holidays',
        method: 'GET',
        data: {
            year: date.year(),
            month: date.month()
        },
        success: function (res) {
            var holidays = res.response;

            for (var i = 0; i < holidays.length; i++) {
                var thisHoliday = holidays[i];

                var listItem = $('li[data-complete-date="' + thisHoliday.date + '"]');

                $(document).on('click', '.prev', function () {
                    previousMonth();
                });

                if (listItem) {
                    listItem.addClass('holiday');
                    listItem.text(listItem.text() + ' - ' + thisHoliday.name);
                }
                $(document).on('click', '.next', function () {
                    nextMonth();
                });

                if (listItem) {
                    listItem.addClass('holiday');
                    listItem.text(listItem.text() + ' - ' + thisHoliday.name);
                }
            }
        },
        error: function () {
            console.log('Errore chiamata festività');
        }
    });
}