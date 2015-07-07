(function($){
   $.fn.extend({
      myPersonalCalendar: function(selectedClass) {
         return this.each(function(){
            console.log($(this));
            $(this).empty();
            // init vars
            var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
            var today = new Date();
            var month = today.getMonth();
            var year = today.getFullYear();
            // console.log(today);

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
            tableContent.find('div.prevMonth').click(function(e){
               e.preventDefault();
               month -= 1;
               if (month == -1) {
                  year -= 1;
                  month = 11;
               };
               drawingCalendar(month, year);               
            });
            tableContent.find('div.nextMonth').click(function(e){
               e.preventDefault();
               month += 1;
               if (month % 12 == 0) {
                  year += 1;
                  month = 0;
               };
               drawingCalendar(month, year);               
            });


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
               // console.log(lastDay);
               
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
               // console.log(indexDays.days);

               // drawing the calendar in table
               var tableRowTmp = $('<tr><tr>');
               for (var i = 0; i < indexDays.days.length; i++) {
                  var currentDay = indexDays.days[i].split('-');
                  var tmpCurrentMonth = parseInt(currentDay[1]) + 1;
                  var currentDayDate = currentDay[0] + '-' + (tmpCurrentMonth < 10 ? '0' + tmpCurrentMonth : tmpCurrentMonth) + '-' + currentDay[2];
                  // console.log(currentDayDate + ' ' + todayDate);
                  if (currentDayDate == todayDate) {
                     currentDayClass = selectedClass+' today selected-day';
                  } else {
                     if (parseInt(currentDay[1]) != month) {
                        currentDayClass = selectedClass+' other-month';
                     } else {
                        currentDayClass = selectedClass;
                     }
                  }
                  
                  var tmp = $('<td data-date="'+currentDayDate+'"> <div class="'+currentDayClass+'" data-date="'+currentDayDate+'"><p>'+parseInt(currentDay[2])+'</p></div> </td>');
                  tableRowTmp.append(tmp);
                  if ((i+1) % 7 == 0) {
                     tableBody.append(tableRowTmp);
                     tableRowTmp = $('<tr></tr>');
                  }
               };
               tableBody.find('tr').eq(0).remove();

               // load week selected if
               if (selectedClass == 'active-day-for-week') {
                  tableContent.find('div.today').each(function(){
                     functionOnClickWeek($(this));
                  });
               };
               // define the action in active days
               tableContent.find('div.active-day').on('click', function(e){
                  e.preventDefault();
                  functionOnClickDay($(this));
               });
               tableContent.find('div.active-day-for-week').on('click', function(e){
                  e.preventDefault();
                  functionOnClickWeek($(this));
               });
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
               /*if (nday == 0) 
                  nday = 6;
               else
                  nday--;*/
               return nday;
            }
            // custom function where we write the events to lanuch on click a day
            function functionOnClickDay(item){
               console.log( item.data('date') );
               var allDays = item.parent().parent().parent().find('div');
               allDays.removeClass('selected-day');
               item.addClass('selected-day');
            }
            // custom function where we write the events to lanuch on click a day
            function functionOnClickWeek(item){
               var row = item.parent().parent();
               row.siblings().removeClass('selected-week');
               row.addClass('selected-week');
               var days = row.find('td');
               console.log( days.eq(0).data('date') + '_' + days.eq(days.length - 1).data('date'));
            }
         });
      }, // end function
      
   });
})(jQuery)
