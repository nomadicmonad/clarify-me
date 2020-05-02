

export const today = new Date((new Date()).getYear()+ 1900,(new Date()).getMonth(),(new Date()).getDate());
export const years = Array.from({length: (new Date()).getYear() - 100}, (x, i) => String(i + 2000)).reverse();
export const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const thisMonth = new Date(today.getYear()+1900,today.getMonth());
export const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
export const daysFormal = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
export const earliestDate = new Date(2000,0,1);
export const hours = Array.from({length: 24}, (x, i) => i < 10 ? "0" + String(i) : String(i))
export const hoursAMPM = Array.from({length: 24}, (x, i) => i < 12 ? String(i%12) + " am" : String(i%12) + " pm")
export const hoursShort = Array.from({length: 24}, (x, i) => String(i%12))
export const minutes = Array.from({length: 60}, (x, i) => i < 10 ? "0" + String(i) : String(i))

export const minutesFrom = (minutes) => {return Array.from({length: 60 - minutes}, (x, i) => i < 10 - minutes ? "0" + String(i + minutes) : String(i+ minutes))}
export const hoursFrom = (hours) => {return Array.from({length: 24 - hours}, (x, i) => i < 10 - hours ? "0" + String(i + hours) : String(i+ hours))}
export const monthToDays = (m, y) => {
        return (new Date(y + 1900, (m+1)%12, 0)).getDate();
    }
export const getDateLists = (selectedMonth, selectedYear) => {
    var days_last_month = monthToDays(parseInt(selectedMonth-1),parseInt(selectedYear));
    var days_this_month = monthToDays(parseInt(selectedMonth)%12,parseInt(selectedYear));
    var dayOffset = getDayOffset(selectedMonth, selectedYear);
    var dateList = []
    var dateListDetailed = []
    var dateListSpecificDates = []
    for (var i = 1; i <= dayOffset; i++) {
        var the_date = days_last_month-dayOffset+i
        dateList.push(the_date)
        dateListDetailed.push(months[(selectedMonth-1)%12] + " " + String(the_date) + getDateSuffix(the_date))
        var dateString = String(the_date) + "/" + String((selectedMonth-1)%12) + "/" + String(selectedMonth == 0 ? selectedYear - 1 : selectedYear)
        dateListSpecificDates.push(dateString)
    }
    for (i = 1; i <= days_this_month; i++) {
        var the_date = i
        dateList.push(the_date);
        dateListDetailed.push(months[selectedMonth] + " " + String(the_date) + getDateSuffix(the_date))
        var dateString = String(the_date) + "/" + selectedMonth%12 + "/" + String(selectedYear)
        dateListSpecificDates.push(dateString)
    }
    for (i = 1; i <= 42 - dayOffset - days_this_month; i++) {
        var the_date = i
        dateList.push(the_date);
        dateListDetailed.push(months[(selectedMonth+1)%12] + " " + String(the_date) + getDateSuffix(the_date))
        var dateString = String(the_date) + "/" + String((selectedMonth+1)%12) + "/" + String(selectedMonth == 11 ? selectedYear + 1 : selectedYear)
        dateListSpecificDates.push(dateString)
    }
    return [dateList,dateListDetailed,dateListSpecificDates]
};  
export const getIndexToday = (selectedMonth, selectedYear) => {
    return getDayOffset(selectedMonth, selectedYear) + (new Date()).getDate() - 1;
}; 

export const getDayOffset = (selectedMonth, selectedYear) => {
    var today = new Date(selectedYear + 1900, selectedMonth, 1)
    return (today.getDay()-1)%7 + 7;
} 
export const getDateSuffix = (the_date) => {
        switch (the_date) {
            case 1: return 'st';
            case 21: return 'st';
            case 31: return 'st';
            case 2: return 'nd';
            case 22: return 'nd';
            case 3: return 'rd';
            case 23: return 'rd';
            default: return 'th';
        }
}