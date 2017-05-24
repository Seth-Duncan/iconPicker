;(function ( $, window, document, undefined ) {

    var dbTimer;

    // Create the defaults once
    var pluginName = "kIconSelect",
        defaults = {
            
            iconSelectorClass: "icon-select",
            iconSelectorContainerClass: "icon-select__container",

            iconSelectorSelectedIconClass: "icon-select__selected-item-row",

            iconSelectorFilterClass: "icon-select__filter-row__filter",
            iconSelectorFilterAdditionalClass: "",

            iconSelectorFilterClear: "icon-select__filter-clear",

            iconSelectorIconListClass: "icon-select__icon-list",
            iconSelectorIconListItemClass: "icon-select__icon-list__item",


            //Class Modifiers
            selectorActive: "icon-select--active",
            selectorShow: "icon-select--show",
            selectorFilterActive: "icon-select--filtering",

            availableIcons: [],

            alternateInput: null,

            fontLibrary: "md",

            defaultIcon: "check",

            debounceTime: 500,
            showHideTransitionTime: 400,
            selectedIconSize: 32,
            iconSize: 16,

            closeOnSelect: true,

            filterEnabled: true

        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this.iconSelectElement;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            
            this._setupMarkup();
            this._initEvents();
        

        },

        _setupMarkup: function (){

            var self = this;

            $("<div class='" + self.options.iconSelectorClass + "'><div class='" + self.options.iconSelectorContainerClass + "'></div></div>").insertAfter($(self.element));

            //Important we set this item up because it's used EVERYWHERE throughout the class.

            this.iconSelectElement = $(self.element).siblings(self._eClass(self.options.iconSelectorClass));

            var isObj =  $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorContainerClass));



            $(isObj).append("<div class='" + self.options.iconSelectorSelectedIconClass + "'>" + self._buildIcon(self.options.defaultIcon, self.options.selectedIconSize) + "</div>")
            $(isObj).append("<div class='icon-select__filter-row'><input type='text' class='" + self.options.iconSelectorFilterClass + " " + self.options.iconSelectorFilterAdditionalClass + "' placeholder='Filter Icons'/><button class='" + self.options.iconSelectorFilterClear + "'>x</a></button>");

            $(isObj).append("<div class='" + self.options.iconSelectorIconListClass+ "'></div>");

            var iconList = $(isObj).find(self._eClass(self.options.iconSelectorIconListClass));

            $(self.options.availableIcons).each(function (i,f){
                $(iconList).append("<div class='" + self.options.iconSelectorIconListItemClass + "'>" + self._buildIcon(f, self.options.iconSize) + "</div>");
            });



        },

        _buildIcon: function(icon, size){
            if(this.options.fontLibrary == "md"){
                return "<i class='material-icons md-" + size + "'>" + icon + "</i>";
            }else if(this.options.fontLibrary == "fa"){
                return "<i class='fa " + icon + "'></i>";
            }
        },

        _initEvents: function(){


            var self = this;

            $(self.element).on("click", function(e){

                e.preventDefault();
                self.showSelector();

            });

            $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorIconListClass)).on("click", self._eClass(self.options.iconSelectorIconListItemClass), function (e){
                
                var icon = $(this).text();
                self.setSelectedIcon(icon);

                if(self.options.closeOnSelect){
                    self.hideSelector();
                }

            });

            if (self.options.filterEnabled){

                $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorFilterClear)).on("click", function (){



                });


                $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorFilterClass)).on("keyup", function() {

                    clearTimeout(dbTimer);

                    var searchStr = $(this).val();

                    dbTimer = setTimeout (function (){
                    
                        if (searchStr != ""){
                            $(self.iconSelectElement).addClass(self.options.selectorFilterActive);
                            $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorIconListItemClass) + " i:contains('" + searchStr+ "')").parent().addClass("item--matched");
                        }else{
                            $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorIconListItemClass)).parent().removeClass("item--matched");
                            $(self.iconSelectElement).removeClass(self.options.selectorFilterActive);
                        }
                    }, self.options.debounceTime);

                });


            }


        },

        _eClass: function(className) {
            return "." + className;
        },


        showSelector: function (){

            var self = this;

            $(self.iconSelectElement).addClass(self.options.selectorActive);
            setTimeout(function (){
                $(self.iconSelectElement).addClass(self.options.selectorShow);

                /*Add Event Handler While Open */
                $(document).on("click.closeIconSelect", function(e){
                    
                    if ($(e.target).closest(self._eClass(self.options.iconSelectorClass)).length < 1){
                        ///Close Selector and terminate click handler for everything
                        
                        self.hideSelector();


                    }
                });

            }, 300);

            

        },

        hideSelector: function (){

            var self = this;

            $(self.iconSelectElement).removeClass(self.options.selectorShow)
            setTimeout(function(){
                $(self.iconSelectElement).removeClass(self.options.selectorActive);
                $(document).off("click.closeIconSelect");
            }, 500);


            
        },

        setSelectedIcon: function(icon){

            var self = this;

            if (self.options.alternateInput != null){
                $(self.options.alternateInput).val(icon).change();
            }

            $(self.iconSelectElement).find(self._eClass(self.options.iconSelectorSelectedIconClass)).empty().append(self._buildIcon(icon, self.options.selectedIconSize));

        },

        filterIcons: function(searchStr){



        }

    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );