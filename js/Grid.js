    var extraSortStylingApplied = 0;
    var sortDirection = "desc";
    //var sortGlobalDirection = "asc";
    var sortColumn = "";
    var globalFilter = "";
    var textSortLabel = "";
    var textFilterLabel = "grid is unfiltered";

    function onDataBound(arg)
    {
        var grid = $("#grid").data("kendoGrid");
        var currentPage = grid.dataSource.page();

        var currentpageText = "grid page " + currentPage;

        var ds = grid.dataSource;

        var sort = ds.sort();
        var sortText = "grid is unsorted";
        if (sort && sort.length > 0) {
            for (var i = 0; i < sort.length; i++) {
                var txt = "Sorting column " + sort[i].field + " ";
                sortText = outputText(txt, sort[i].dir);
                textSortLabel = sortText;
            }
        }
        else {
            sortText = "grid is unsorted";
            textSortLabel = sortText;
        }

        var pagerCount = grid._data.length;
        var totalCount = grid.dataSource._data.length;
        var totalRecords = "showing " + pagerCount + " records, of a total of " + totalCount + " records";

        var outputHTML = "<ul><li>"
            + sortText + "</li><li>"
            + textFilterLabel + "</li><li>"
            + currentpageText + "</li><li>"
            + totalRecords + "</li></ul>";

        $('#grid-info').html(outputHTML);

        if (extraSortStylingApplied == 0) {
            $("th.k-header").each(function () {
                var columnName = $(this).attr('data-field');
                var columnData = "'" + $(this).attr('data-field') + "'";
                var dataField = $(this).parent().attr('data-field');

                var varString = 0;
                var varNumber = 0;
                var varBoolean = 0;
                var filterVisible = true;

                for (i = 0; i < grid.dataSource._data.length; i++) {
                    
                    if (typeof (grid.dataSource._data[i][columnName]) == "string") {
                        varString++;
                    }
                    if (typeof (grid.dataSource._data[i][columnName]) == "number") {
                        varNumber++;
                    }
                    if (typeof (grid.dataSource._data[i][columnName]) == "boolean") {
                        varBoolean++;
                    }
                }               

                if (varString > varNumber && varString > varBoolean) {
                    $(this).attr('data-type', 'string');
                    varString = 0;
                }
                else if (varNumber > varString && varNumber > varBoolean) {
                    $(this).attr('data-type', 'number');
                    varNumber = 0;
                }
                else if (varBoolean > varString && varBoolean > varNumber) {
                    $(this).attr('data-type', 'boolean');
                    varBoolean = 0;
                }
                else {
                    filterVisible = false;
                }

                $(this).html('<a href="#" class="sort" onclick="Sort(' + columnData + ')"><span class="hiddenLink coloredSpan">sort column </span>' + columnName + "<span class='sortSpan'></span></a>");
                if (filterVisible) {
                    $(this).append('<a href="#" onclick="Filter(' + columnData + ')"><span class="hiddenLink coloredSpan">filter column ' + columnName + "</span><img class='k-filterIcon' alt='' src='@Url.Content("~/content/images/filtericon.png")'></a>");
                }
            });
            extraSortStylingApplied = 1;
        }  

        $("#popup_window").kendoWindow({
            modal: true,
            height: "200px",
            visible: false,
            resizable: false,
            draggable: false,
            width: "500px"
        });
    }

    function Filter(columnName) {
        globalFilter = columnName;
        var f = "";
        var grid = $("#grid").data("kendoGrid");

        var filterDatatype = $("th.k-header[data-field=" + columnName + "]").attr('data-type');
        
        switch (filterDatatype) {
            case "string":
                f = '<form><input type="hidden" id="data-type" value="string"><fieldset> <legend>Filter Criteria</legend> <label for="criteria1">criteria 1</label> <select id="criteria1" name="select"> <option value="eq"> Is equal to </option> <option value="ne"> Is not equal to </option> <option value="startswith"> Starts with </option> <option value="contains"> Contains </option> <option value="doesnotcontain"> Does not contain </option> <option value="endswith"> Ends with </option> </select> <label for="criteria1text">criteria 1 value</label> <input id="criteria1text" type="text" value=""> </fieldset><input onclick="applyFilterCriteria()" type="button" value= "filter"> <input type="button" value="reset grid" onclick="clearFilterCriteria()"> </form>';
                dialogPopup("open", columnName, f);
                break;
            case "number":
                alert("number");
                break;
            case "boolean":
                f = '<form><input type="hidden" id="data-type" value="boolean"><fieldset><legend>Filter Criteria</legend> <label for="criteria1">criteria 1</label> <select id="criteria1" name="select"> <option value="true">True</option> <option value="false">False</option></select> </fieldset><input onclick="applyFilterCriteria()" type="button" value= "filter"> <input type="button" value="reset grid" onclick="clearFilterCriteria()"> </form>';
                dialogPopup("open", columnName, f);
                break;
        }        
    }

    function dialogPopup(state, columnName, filterHTML) {
        var win = $("#popup_window").data("kendoWindow");
        
        switch (state) {
            case "open":
                $("#popup_window").html(filterHTML);
                win.title("Filter " + columnName);
                win.center();
                win.open();
                break;
            case "close":
                win.close();
                break;
        }        
    }

    function Sort(columnName) {
        var gridData = $("#grid").data("kendoGrid");
        
        if (sortColumn == columnName) {
            gridData.dataSource.sort({ field: columnName, dir: sortDirection });
            
            switch (sortDirection) {
                case "asc":
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").addClass("sortUp");
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").removeClass("sortDown");
                    sortDirection = "desc";
                    break;
                case "desc":
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").addClass("sortDown");
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").removeClass("sortUp");
                    sortDirection = "";
                    break;
                case "":
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").removeClass("sortDown");
                    $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").removeClass("sortUp");
                    sortDirection = "asc";
                    break;
            }
        }
        else {
            $("th.k-header[data-field=" + columnName + "]>a.sort>span.sortSpan").addClass("sortUp");
            gridData.dataSource.sort({ field: columnName, dir: "asc" });
            sortDirection = "desc";
        }
        sortColumn = columnName;
    }

    function outputText(txt, dir) {
        switch (dir) {
            case "asc":
                return txt + "ascending";
            case "desc":
                return txt + "descending";
        }
    }

    function clearFilterCriteria() {
        var gridData = $("#grid").data("kendoGrid");
        textFilterLabel = "grid is unfiltered";
        gridData.dataSource.filter({});
        dialogPopup("close", null, null);
    }


    function applyFilterCriteria() {
        var gridData = $("#grid").data("kendoGrid");

        switch ($('#data-type').val()) {
            case "string":
                var criteriaValue = "";

                if ($('#criteria1text').val() == "") {
                    criteriaValue = "BLANK";
                }
                else {
                    criteriaValue = $('#criteria1text').val();
                }

                textFilterLabel = "Filtering column " + globalFilter + " " + $('#criteria1').val() + " " + criteriaValue;
                gridData.dataSource.filter({ field: globalFilter, operator: $('#criteria1').val(), value: criteriaValue });
                break;
            case "boolean":
                var bool = toBoolean($('#criteria1').val());
                textFilterLabel = "Filtering column " + globalFilter + " " + $('#criteria1').val();
                gridData.dataSource.filter({ field: globalFilter, operator: "eq", value: bool });
                break;
        }

        dialogPopup("close", null, null);
    }

    function toBoolean(val)
    {
        switch (val.toLowerCase()) {
            case "true": case "yes": case "1": return true;
            case "false": case "no": case "0": case null: return false;
            default: return Boolean(val);
        }
    }

    $(function () {
        $('#showHidden').click(function () {
            var state = $(this).is(":checked");
            if (state) {
                $('th.k-header').find('span.hiddenLink').removeClass('hideSpanText');
                $('#grid-info').removeClass('hideSpanText');
            }
            else {
                $('th.k-header').find('span.hiddenLink').addClass('hideSpanText');
                $('#grid-info').addClass('hideSpanText');
            }
        });
    });
