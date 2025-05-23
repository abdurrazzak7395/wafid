var SELECT_ALL_LIMIT = 100;

$(function () {
    // Define the adapter once to avoid redundant definitions
    let adapterDefined = false;
    const defineAdapter = function () {
        if (adapterDefined) return;
        adapterDefined = true;

        $.fn.select2.amd.define('select2/selectAllAdapter', [
            'select2/utils',
            'select2/dropdown',
            'select2/dropdown/attachContainer',
        ], function (Utils, DropdownAdapter, AttachContainer) {
            function SelectAll() {}

            SelectAll.prototype.render = function (decorated) {
                var self = this,
                    $rendered = decorated.call(this),
                    $selectAll = $( 
                        '<button class="mini ui button select-all-btn" type="button"><i class="icon check square"></i> Select All</button>' 
                    ),
                    $btnContainer = $('<div style="margin-top:3px;">').append($selectAll);

                if (!this.$element.prop("multiple")) {
                    return $rendered;
                }

                // Insert the "Select All" button before the results
                $btnContainer.insertBefore($rendered.find('.select2-results'));

                // Handle "Select All" button click
                $selectAll.on('click', function (e) {
                    var $results = $rendered.find('.select2-results__option[aria-selected=false]');
                    $results.each(function () {
                        $(this).mousedown();
                        $(this).mouseup();
                    });

                    self.$element.select2("close");
                });

                return $rendered;
            };

            return Utils.Decorate(
                Utils.Decorate(
                    DropdownAdapter,
                    AttachContainer
                ), SelectAll
            );
        });
    };

    // Apply select2 with custom adapter only once to all relevant elements
    $('select[multiple][data-select-all-option=true]').each(function () {
        // Define the adapter once
        defineAdapter();

        // Safely merge options
        var options = $(this).data('select2') ? $(this).data('select2').options : {};
        if (!options.options) {
            options.options = {};  // Initialize options if undefined
        }

        // Add the custom dropdown adapter to the options
        options.options["dropdownAdapter"] = $.fn.select2.amd.require('select2/selectAllAdapter');

        // Re-initialize Select2 with the updated options
        $(this).select2(options.options);
    });

});
