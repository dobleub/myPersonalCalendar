(function($){
   $.fn.extend({
      myPersonalCalendar: function(options) {
         var settings = $.extend({
            selectedClass: "active-day",
            text: null,
            onLoad: null,
            onReload: null,
            onClickDay: null,
            selectDateAlways: false,
         }, options);

         return this.each(function(){
            $(this).empty();
            // init vars
            var dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();

            // creating the elements
            var tableContent = $('<table class="tableMyCalendar" cellspacing="0"></table>');
            var tableHead = $('<thead class="headMyCalendar">\
               <tr>\
                  <td> <div class="prevMonth"><</div> </td>\
                  <td colspan="5"> <label><span class="currentMonth"></span></label> </td>\
                  <td> <div class="nextMonth">></div> </td>\
               </tr>\
               <tr><td class="dayLabel">D</td><td class="dayLabel">L</td><td class="dayLabel">M</td><td class="dayLabel">M</td><td class="dayLabel">J</td><td class="dayLabel">V</td><td class="dayLabel">S</td></tr>\
               </thead>');
            var tableBody = $('<tbody class="bodyMyCalendar"></tbody>');
            
            // rendering the elements in current class
            tableContent.append(tableHead);
            tableContent.append(tableBody);
            $(this).append(tableContent);
            
            // setting and drawing the content
            drawingCalendar(month, year);
            var todayPosition = gettingNumberDayWeek(today.getDate(), month, year);
            var setDateTi = $('<h1 class="h1">'+dayNames[ (todayPosition == dayNames.length ? 0 : todayPosition) ]+' '+today.getDate()+'</h1><h2 class="h2">'+monthNames[month]+'</h2>');
            $('.ti').empty().append(setDateTi);

            tableContent.find('div.prevMonth').click(function(e){
               e.preventDefault();
               month -= 1;
               if (month == -1) {
                  year -= 1;
                  month = 11;
               };
               drawingCalendar(month, year);
               // on reload calendar action
               onEventReloadOption(settings.onReload, settings.selectDateAlways, month, year);
            });
            tableContent.find('div.nextMonth').click(function(e){
               e.preventDefault();
               month += 1;
               if (month % 12 == 0) {
                  year += 1;
                  month = 0;
               };
               drawingCalendar(month, year);
               // on reload calendar action
               onEventReloadOption(settings.onReload, settings.selectDateAlways, month, year);
            });

            // on load calendar action
            onEventLoadOption(settings.onLoad);

            // drawing calendar
            function drawingCalendar(month, year) {
               tableContent.find('span.currentMonth').text(monthNames[month] + ' ' + year);
               var firstDayPosition = gettingNumberDayWeek(1, month, year);
               var lastDay = lastDayMonth(month, year);
               var prevMonth = ((month-1) == -1 ? 11 : month-1);
               var prevYear = (prevMonth == 11 ? (year-1) : year);
               var lastDayPrevMonth = lastDayMonth(prevMonth, prevYear);
               var nextMonth = ((month+1) > 11 ? 0 : month+1);
               var nextYear = (nextMonth == 0 ? (year+1) : year);

               var tmpTodayMonth = today.getMonth() + 1;
               var tmpTodayDay = today.getDate();
               var todayDate = today.getFullYear() + '-' + (tmpTodayMonth <  10 ? '0' + tmpTodayMonth : tmpTodayMonth) + '-' + (tmpTodayDay < 10 ? '0' + tmpTodayDay : tmpTodayDay);
               
               
               tableBody.empty();

               var tableDays = '';
               var indexDays = new Array();
               indexDays.days = [];
               l = 0;
               for (var i = 0; i < firstDayPosition; i++) {
                  l += 1;
               };
               tmpLastDayPrevMonth = lastDayPrevMonth - (l-1);
               for (var i = 0; i < firstDayPosition; i++) {
                  indexDays.days[i] = prevYear + '-' + (prevMonth < 10 ? '0' + prevMonth : prevMonth) + '-' +(tmpLastDayPrevMonth < 10 ? '0' + tmpLastDayPrevMonth : tmpLastDayPrevMonth);
                  tmpLastDayPrevMonth++;
               };
               maxItemsInCalendar = 42;
               l = 1;
               for (var i = 0; i < maxItemsInCalendar; i++) {
                  var tmp = gettingNumberDayWeek(i+1, month, year);
                  if (i < lastDay) {
                     var tmpI = i+1;
                     indexDays.days[firstDayPosition++] = year + '-' + (month < 10 ? '0' + month : month) + '-' + (tmpI < 10 ? '0' + tmpI : tmpI);
                  } else {
                     indexDays.days[firstDayPosition++] = nextYear + '-' + (nextMonth < 10 ? '0' + nextMonth : nextMonth) + '-' + (l < 10 ? '0' + l : l);
                     l++;
                  }
               };

               // drawing the calendar in table
               var tableRowTmp = $('<tr><tr>');
               var todayExist = 0;
               for (var i = 0; i < indexDays.days.length; i++) {
                  var currentDay = indexDays.days[i].split('-');
                  var tmpCurrentMonth = parseInt(currentDay[1]) + 1;
                  var currentDayDate = currentDay[0] + '-' + (tmpCurrentMonth < 10 ? '0' + tmpCurrentMonth : tmpCurrentMonth) + '-' + currentDay[2];
                  
                  if (currentDayDate == todayDate) {
                     currentDayClass = settings.selectedClass+' today selected-day';
                     todayExist = 0;
                  } else {
                     if (parseInt(currentDay[1]) != month) {
                        currentDayClass = settings.selectedClass+' other-month';
                     } else {
                        currentDayClass = settings.selectedClass;
                     }
                     todayExist++;
                  }
                  
                  var tmp = $('<td data-date="'+currentDayDate+'"> <div class="'+currentDayClass+'" data-date="'+currentDayDate+'"><p>'+parseInt(currentDay[2])+'</p></div> </td>');
                  tableRowTmp.append(tmp);
                  if ((i+1) % 7 == 0) {
                     tableBody.append(tableRowTmp);
                     tableRowTmp = $('<tr></tr>');
                  }
               };
               tableBody.find('tr').eq(0).remove();
               if (todayExist == indexDays.days.length && settings.selectDateAlways == true) {
                  tableBody.find('div.active-day[data-date='+year+'-'+((month+1)<10 ? '0'+(month+1) : (month+1))+'-01]').addClass('selected-day');
                  tableBody.find('div.active-day-for-week[data-date='+year+'-'+((month+1)<10 ? '0'+(month+1) : (month+1))+'-01]').addClass('selected-day');
               };

               // paint selected week if
               if (settings.selectedClass == 'active-day-for-week') {
                  tableContent.find('div.selected-day').each(function(){
                     functionOnClickWeek($(this));
                  });
               };

               // on click day action
               onEventClickOption(settings.onClickDay);
               
            }

            // checking date
            function checkdate ( m, d, y ) {
               // función por http://kevin.vanzonneveld.net
               // extraida de las librerías phpjs.org manual en http://www.desarrolloweb.com/manuales/manual-librerias-phpjs.html
               return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
            }
            // last day of Month
            function lastDayMonth(month, year){ 
               var lastDay=28; 
               while (checkdate(month+1, lastDay+1, year)){ 
                  lastDay++; 
               } 
               return lastDay; 
            }
            // getting number o day
            function gettingNumberDayWeek(day, month, year){
               var objDate = new Date(year, month, day);
               var nday = objDate.getDay();
               
               return nday;
            }
            // custom function where we write the events to lanuch on click a day
            function functionOnClickDay(item){
               var allDays = item.parent().parent().parent().find('div');
               allDays.removeClass('selected-day');
               item.addClass('selected-day');
               var day = new Date(item.data('date'));
               
               return item.data('date');
            }
            // custom function where we write the events to lanuch on click a day
            function functionOnClickWeek(item){
               var row = item.parent().parent();
               row.siblings().removeClass('selected-week');
               row.addClass('selected-week');
               var days = row.find('td');
               
               return days.eq(0).data('date') + '_' + days.eq(days.length - 1).data('date');
            }

            // functions onEvent options
            function onEventClickOption(option){
               if ($.isFunction(option)) {
                  if (settings.selectedClass == 'active-day') {
                     tableContent.find('div.active-day').on('click', function(e){
                        e.preventDefault();
                        var currentDay = functionOnClickDay($(this));
                        
                        option.call( this, currentDay );
                     });
                  };
                  if (settings.selectedClass == 'active-day-for-week') {
                     tableContent.find('div.active-day-for-week').on('click', function(e){
                        e.preventDefault();
                        var range = functionOnClickWeek($(this));
                        
                        option.call( this, range );
                     });
                  };
               };
            }
            function onEventLoadOption(option){
               if ($.isFunction(option)) {
                  if (settings.selectedClass == 'active-day') {
                        var selectedDay = tableContent.find('div.selected-day');
                        var currentDay = selectedDay.data('date');
                        
                        option.call( this, currentDay );
                  };
                  if (settings.selectedClass == 'active-day-for-week') {
                        var selectedRange = tableContent.find('div.selected-day').parent().parent().find('td');
                        var range = selectedRange.eq(0).data('date') + '_' + selectedRange.eq(selectedRange.length - 1).data('date');
                        
                        option.call( this, range );
                  };
               };
            }
            function onEventReloadOption(option, selectDateAlways, month, year){
               if (selectDateAlways == true) {
                  onEventLoadOption(option);
               } else {
                  if (settings.selectedClass == 'active-day') {
                     var selectedDay = tableContent.find('div.selected-day');
                     if (selectedDay.length > 0) {
                        var currentDay = selectedDay.data('date');
                     } else {
                        var currentDay = year+'-'+((month+1)<10 ? '0'+(month+1) : (month+1))+'-01';
                     }
                     option.call(this, currentDay);
                  };
                  if (settings.selectedClass == 'active-day-for-week') {
                     var selectedRange = tableContent.find('div.selected-day').parent().parent().find('td');
                     if (selectedRange.length > 0) {
                        var range = selectedRange.eq(0).data('date') + '_' + selectedRange.eq(selectedRange.length - 1).data('date');
                     } else {
                        var selectedRange = tableContent.find('div.active-day-for-week[data-date='+year+'-'+((month+1)<10 ? '0'+(month+1) : (month+1))+'-01'+']').parent().parent().find('td');
                        var range = selectedRange.eq(0).data('date') + '_' + selectedRange.eq(selectedRange.length - 1).data('date');
                     }
                     option.call(this, range);
                  };
               }
            }

         });
      }, // end function

   });
})(jQuery)
