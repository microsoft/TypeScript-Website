/*!
 * rjAccordion jQuery Plugin v0.0
 * *
 * @author Raja Jaganathan 
 *  
 */
(function($) {

    'use strict';

    function Accordion(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Accordion.defaults, options);
    }

    Accordion.prototype.constructor = Accordion;

    Accordion.defaults = {
        transition_delay: 300,
        toggle: true
    };

    Accordion.prototype.init = function() {
        var $this = this.$element;
        var options = this.options;

        function closeAccordionSection() {
            $this.find('.accordion-section-header').removeClass('active');
            $this.find('.accordion-section-content').slideUp(options.transition_delay).removeClass('open');
        }

        function closeAccordionBy($accodionSection) {
            $accodionSection.find('.accordion-section-header').removeClass('active');
            $accodionSection.find('.accordion-section-content').slideUp(options.transition_delay).removeClass('open');
        }

        function openAccordion($targetAccordion) {
            var targetContainer = $targetAccordion.data('target');
            $targetAccordion.addClass('active');
            $this.find(targetContainer).slideDown(options.transition_delay).addClass('open');
        }

        $this.find('.accordion-section-header').click(function(e) {
            e.preventDefault();

            if (options.toggle) {
                if ($(e.target).is('.active')) {
                    closeAccordionSection();
                } else {
                    closeAccordionSection();
                    openAccordion($(this));
                }
            } else {
                if ($(e.target).is('.active')) {
                    closeAccordionBy($(this).closest('.accordion-section'));
                } else {
                    openAccordion($(this));
                }
            }
        });
    };

    var oldAccordion = $.fn.rjAccordion;

    $.fn.rjAccordion = function(options) {
        return this.each(function() {
            var data = new Accordion(this, options);
            data.init();
        });
    };

    $.fn.rjAccordion.constructor = Accordion;

    $.fn.rjAccordion.noConflict = function() {
        $.fn.rjAccordion = oldAccordion;
        return this;
    };

})(window.jQuery);
