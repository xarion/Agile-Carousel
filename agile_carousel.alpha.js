/*
 * Agile Carousel v alpha 1.1
 * http://agilecarousel.com/
 *
 * Copyright 2011, Ed Talmadge
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * 
 */
(function ($) {

    $.fn.agile_carousel = function (options) {

        var defaults = {
            transition_type: "slide",
            transition_time: 600,
            number_slides_visible: 1,
            is_vertical: false,
            get_reset: null,
            previous_button_selector: ".previous_button",
            next_button_selector: ".next_button",
            reset_button_selector: ".reset_button",
        };

        options = $.extend(defaults, options);

        return this.each(function () {
            var number_of_slides = 0,
                ac_html = "",
                bd = "",
                button_action = "",
                current_slide_number = "",
                next_slide_number = false,
                current_slide_index = "",
                next_slide_index = "",
                current_slide = "",
                next_slide = "",
                carousel_outer_width = options.carousel_outer_width,
                carousel_outer_height = options.carousel_outer_height,
                carousel_data = options.carousel_data,
                slide_width = options.slide_width,
                slide_height = options.slide_height,
                persistent_content = options.persistent_content,
                number_slides_visible = options.number_slides_visible,
                transition_type = options.transition_type,
                transition_time = options.transition_time,
                is_vertical = options.is_vertical,
                previous_button_selector = options.previous_button_selector,
                next_button_selector = options.next_button_selector,
                reset_button_selector = options.reset_button_selector,
                content = "",
                obj_inner = "",
                number_of_slides_vertical = 1,
                number_of_slides_horizontal = 1,
                slide_remainder,
                slide_number_conversion_array = [],
                i,
                j,
                k,
                obj = $(this),
                key,
                ac_slides,
                ac_slides_container,
                agile_carousel,
                ac_previous_buttons,
                ac_previous_buttons_length,
                ac_next_buttons,
                previous_button,
                previous_button_length,
                next_button,
                next_button_length,
                slide_number_conversion_array_last,
                curr_lookup,
                animate_current_slide_to,
                temp;

            if (options.get_reset !== null) {
                options.get_reset(reset);
            }
            // get the number of slides
            $.each(carousel_data, function () {
                number_of_slides += 1;
            });

            slide_remainder = number_of_slides % number_slides_visible;

            if (is_vertical) {
                number_of_slides_vertical = number_of_slides;
            } else {
                number_of_slides_horizontal = number_of_slides;
            }

            function get_slide_axis() {
                return is_vertical ? "top" : "left";
            }

            function get_static_axis() {
                return is_vertical ? "left" : "top";
            }

            function get_slide_axis_slide_length() {
                return is_vertical ? slide_height : slide_width;
            }

            function get_sliding_axis_base() {
                return is_vertical ? "height" : "width";
            }

            for (i = 1, j = 0; i <= number_of_slides; i += number_slides_visible) {
                slide_number_conversion_array[j] = i;
                j += 1;
            } // for
            // render beginning of div containers
            ac_html += "<div class='agile_carousel' style='overflow: hidden; position: relative; width: " + carousel_outer_width + "px; height: " + carousel_outer_height + "px;'>";

            i = 1;
            for (key in carousel_data) {

                if (carousel_data.hasOwnProperty(key)) {

                    obj_inner = carousel_data[key];
                    content = obj_inner.content;

                    ////////////////////////
                    // Slides
                    ////////////////////////
                    if (i === 1) {
                        ac_html += "<div class='slides' style='width: " + slide_width * number_of_slides_horizontal + "px; height: " + slide_height * number_of_slides_vertical + "px;'>";
                    } // if
                    if (content) {
                        // render
                        ac_html += "<div class='slide_" + i + " slide' style='border: none; margin: 0; padding: 0; height: " + slide_height + "px; width: " + slide_width + "px;'>" + content + "</div>";
                    } // if obj_inner.content
                    if (i === number_of_slides) {
                        ac_html += "</div>";
                    }

                    i += 1;
                } // if has own property
            } // for
            $(previous_button_selector).data("options", {
                disabled: false,
                button_action: "previous"
            });

            $(next_button_selector).data("options", {
                disabled: false,
                button_action: "next"
            });

            if (persistent_content) {
                ac_html += persistent_content;
            }

            ac_html += "</div>";

            obj.html(ac_html);

            ac_slides = obj.find(".slide");
            ac_slides_container = obj.find(".slides");
            agile_carousel = obj.find(".agile_carousel");
            ac_previous_buttons = $(previous_button_selector);
            ac_previous_buttons_length = ac_previous_buttons.length;
            ac_next_buttons = $(next_button_selector);
            // kludge - above variables not working in disable_buttons function - disabled is undefined in disable_buttons function
            previous_button = $(previous_button_selector);
            previous_button_length = previous_button.length;
            next_button = $(next_button_selector);
            next_button_length = next_button.length;

            function disable_buttons(slide_num) {

                if (number_slides_visible < 2) {

                    // if first slide
                    if (slide_num === 1) {
                        if (previous_button_length > 0) {
                            previous_button.addClass("ac_disabled");
                            previous_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (previous_button_length > 0) {
                            previous_button.removeClass("ac_disabled");
                            previous_button.data("options").disabled = false;
                        } // if
                    }

                    // if last slide
                    if (slide_num === number_of_slides) {
                        if (next_button_length > 0) {
                            next_button.addClass("ac_disabled");
                            next_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (next_button_length > 0) {
                            next_button.removeClass("ac_disabled");
                            next_button.data("options").disabled = false;
                        } // if
                    }

                } // if
                if (number_slides_visible > 1) {

                    // if first slide
                    if (slide_num <= number_slides_visible) {
                        if (previous_button_length > 0) {
                            previous_button.addClass("ac_disabled");
                            previous_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (previous_button_length > 0) {
                            previous_button.removeClass("ac_disabled");
                            previous_button.data("options").disabled = false;
                        } // if
                    }
					
					//5 visible_slides and 4 number_of_slides cause a bug
					if((number_of_slides % number_slides_visible)==(number_slides_visible - 1)){slide_num=slide_num+2;}
					
                    // if last slide
                    if (slide_num >= (number_of_slides - number_slides_visible + slide_remainder)) {
                        if (next_button_length > 0) {
                            next_button.addClass("ac_disabled");
                            next_button.data("options").disabled = true;
                        } // if
                    } else {
                        if (next_button_length > 0) {
                            next_button.removeClass("ac_disabled");
                            next_button.data("options").disabled = false;
                        } // if
                    }

                } // if
            } // function
            // prepare carousel for number_slides_visible = 1
            if (number_slides_visible === 1) {
                ac_slides.eq(0).css("position", "absolute");
                ac_slides.eq(0).css(get_static_axis(), 0);
                ac_slides.eq(0).css(get_slide_axis, 0);

                ac_slides.slice(1, number_of_slides).css("position", "absolute");
                ac_slides.slice(1, number_of_slides).css(get_static_axis(), "-5000px");
                ac_slides.slice(1, number_of_slides).css(get_slide_axis(), 0);

                ac_slides_container.css(get_sliding_axis_base(), get_slide_axis_slide_length() + "px");
            }

            // prepare carousel for number_slides_visible > 1
            if (number_slides_visible > 1) {
                agile_carousel.css(get_sliding_axis_base(), number_slides_visible * get_slide_axis_slide_length() + "px");

                for (k = 1; k <= number_of_slides; k += 1) {
                    ac_slides.eq(k).css("position", "absolute");
                    ac_slides.eq(k).css(get_static_axis(), 0);
                    ac_slides.eq(k).css(get_slide_axis(), get_slide_axis_slide_length() * k + "px");
                } // for
            } // if
            // prepare carousel for all
            disable_buttons(1);

            current_slide_number = 1;

            slide_number_conversion_array_last = slide_number_conversion_array[slide_number_conversion_array.length - 1];

            function slide_it(number, isDirect) {
                if (isDirect === true) {
                    if (next_slide_number !== false) {
                        current_slide_number = next_slide_number;
                    }
                    current_slide_index = current_slide_number - 1;
                    current_slide = $(ac_slides).eq(current_slide_index);
                }
                next_slide_number = number;
                next_slide_index = next_slide_number - 1;
                next_slide = $(ac_slides).eq(next_slide_index);

                if (next_slide_index !== current_slide_index) {
                    /////////////////////////////////
                    /////////////////////////////////
                    ///// Sliding Transition - more than one slide visible
                    /////////////////////////////////
                    /////////////////////////////////
                    if (transition_type === "slide" && number_slides_visible > 1) {
                        temp = {};
                        temp[get_slide_axis()] = ((next_slide_number * get_slide_axis_slide_length()) - get_slide_axis_slide_length()) * -1 + "px";
                        ac_slides_container.stop().animate(temp, {
                            duration: transition_time
                        });
                    } // if
                    /////////////////////////////////
                    /////////////////////////////////
                    ///// Sliding Transition - 1 slide visible
                    /////////////////////////////////
                    /////////////////////////////////
                    if (transition_type === "slide" && number_slides_visible === 1) {

                        // change slide position - go forward
                        animate_current_slide_to = "";

                        if (button_action === "next" || (next_slide_number > current_slide_number)) {
                            next_slide.css(get_static_axis(), 0);
                            next_slide.css(get_slide_axis(), get_slide_axis_slide_length());
                            animate_current_slide_to = get_slide_axis_slide_length() * -1;
                        }

                        // change slide position - go back
                        if (button_action === "previous" || (next_slide_number < current_slide_number)) {
                            next_slide.css(get_static_axis(), 0);
                            next_slide.css(get_slide_axis(), get_slide_axis_slide_length() * -1);

                            animate_current_slide_to = get_slide_axis_slide_length();
                        }

                        // animate slides
                        //,{  duration:300, complete: fade_complete}
                        temp = {};
                        temp[get_slide_axis()] = animate_current_slide_to + "px";
                        current_slide.stop().animate(temp, {
                            duration: transition_time,
                            complete: function () {
                                current_slide.css("position", "absolute");
                                current_slide.css(get_static_axis(), "-5000px");
                                current_slide.css(get_slide_axis(), 0);
                            }
                        });

                        temp = {};
                        temp[get_slide_axis()] = "0px";
                        next_slide.stop().animate(temp, {
                            duration: transition_time
                        });
                    } // if transition type is slide	
                } // if current slide is not the next slide
            }

            function reset() {
                slide_it(1, true);
                disable_buttons(1);
            }

            ///////////////////////////////
            ///////////////////////////////
            ///////// Transition Slides
            ///////////////////////////////
            ///////////////////////////////

            function transition_slides(button_data) {

                bd = $(button_data)[0];
                var ac_disabled = bd.disabled;

                if (ac_disabled !== true) {

                    button_action = bd.button_action;
                    ac_disabled = bd.disabled;

                    if (next_slide_number !== false) {
                        current_slide_number = next_slide_number;
                    }

                    current_slide_index = current_slide_number - 1;
                    current_slide = $(ac_slides).eq(current_slide_index);

                    // calculate the next_slide_number
                    ///////////////////////////
                    ///////////////////////////
                    ////// One Slide Visible
                    ///////////////////////////
                    ///////////////////////////
                    if (number_slides_visible < 2) {
                        if (button_action === "next" && current_slide_number < number_of_slides) {
                            next_slide_number = current_slide_number + 1;
                        } else if (button_action === "next" && current_slide_number === number_of_slides) {
                            next_slide_number = 1;
                        }


                        // go back
                        if (button_action === "previous" && current_slide_number > 1) {
                            next_slide_number = current_slide_number - 1;

                            // go to last slide position
                        } else if (button_action === "previous" && current_slide_number === 1) {
                            next_slide_number = number_of_slides;
                        }

                    } // if
                    ///////////////////////////
                    ///////////////////////////
                    ////// Multiple Slides Visible
                    ///////////////////////////
                    ///////////////////////////
                    if (number_slides_visible > 1) {
                        if (button_action === "next") {
                            if (current_slide_number < (number_of_slides - number_slides_visible + slide_remainder)) {
                                next_slide_number = slide_number_conversion_array[Math.ceil(current_slide_number / number_slides_visible)];
                            } else if (number_slides_visible > 1) {
                                next_slide_number = 1;
                            }
                        }

                        // go back
                        if (button_action === "previous" && number_slides_visible > 1) {
                            if (current_slide_number > number_slides_visible) {
                                curr_lookup = Math.floor(current_slide_number / number_slides_visible);
                                curr_lookup = curr_lookup - 1;
                                next_slide_number = slide_number_conversion_array[curr_lookup];
                                // go to last slide position
                            } else {
                                next_slide_number = slide_number_conversion_array_last;
                            }
                        }
                    } // if
                    slide_it(next_slide_number);
                } // if slide button is not disabled && transition complete
                disable_buttons(next_slide_number);

            } // transition_slides;
            $(reset_button_selector).click(function () {
                reset();
            }); // click
            $(previous_button_selector).click(function () {
                transition_slides($(this).data().options);
            }); // click
            $(next_button_selector).click(function () {
                transition_slides($(this).data().options);
            }); // click
        }); // each
    }; // function
})(jQuery);
