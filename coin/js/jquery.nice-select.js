/*  jQuery Nice Select - v1.1.0
    https://github.com/hernansartorio/jquery-nice-select
    Made by Hernán Sartorio  */
 
(function($) {

  $.fn.niceSelect = function(method) {
    const mobWidth = 768;    
    // Methods
    if (typeof method == 'string') {      
      if (method == 'update') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          var open = $dropdown.hasClass('open');
          
          if ($dropdown.length) {
            $dropdown.remove();
            create_nice_select($select);
            
            if (open) {
              $select.next().trigger('click');
            }
          }
        });
      } else if (method == 'destroy') {
        this.each(function() {
          var $select = $(this);
          var $dropdown = $(this).next('.nice-select');
          
          if ($dropdown.length) {
            $dropdown.remove();
            $select.css('display', '');
          }
        });
        if ($('.nice-select').length == 0) {
          $(document).off('.nice_select');
        }
      } else {
        console.log('Method "' + method + '" does not exist.')
      }
      return this;
    }
      
    // Hide native select
    this.hide();
    
    // Create custom markup
    this.each(function() {
      var $select = $(this);
      
      if (!$select.next().hasClass('nice-select')) {
        create_nice_select($select);
      }
    });
    
    function create_nice_select($select) {
      $select.after($('<div></div>')
        .addClass('nice-select')
        .addClass($select.attr('class') || '')
        .addClass($select.attr('disabled') ? 'disabled' : '')
        .attr('tabindex', $select.attr('disabled') ? null : '0')
        .html('<span class="current"></span><ul class="list"></ul>')
      );
       
      var $dropdown = $select.next();
      var $options = $select.find('option');
      var $selected = $select.find('option:selected');
      var $thisLang = $dropdown.closest('.select-lang');

      function selectDirectionDrop(event) {
        const $dropdown = event.data;
        // Получаем высоту документа и позицию элемента относительно верхней границы документа
        const docHeight = Math.max($('body').prop('scrollHeight'), $('html').prop('scrollHeight'), $('body').prop('offsetHeight'), $('html').prop('offsetHeight'), $('body').prop('clientHeight'), $('html').prop('clientHeight'));
        const elementPosTop = $dropdown.offset().top;
        const elementPosBottom = elementPosTop + $dropdown.outerHeight();
        let distanceToBottom;
          const parentWithFixedPosition = $dropdown.parents().filter(function() {
//            console.log(`${$(this).attr('class')} = `, $(this).css('position'));
            return $(this).css('position') === 'fixed';
          });
//          console.log('parents = ', $dropdown.parents());
//          console.log('Position fixed - ', parentWithFixedPosition.length);
          if (parentWithFixedPosition.length > 0) {
//            console.log('Position fixed у блока ', parentWithFixedPosition[0]);
            const fixedElementHeight = parentWithFixedPosition[0].scrollHeight;
            const viewportHeight = $(window).height();
            if (fixedElementHeight > viewportHeight) {
//              console.log('Высота фиксед элемента больше высоты вьюпорта');
              const elementBottom = $dropdown.offset().top + $dropdown.outerHeight();
              const parentBottom = parentWithFixedPosition.offset().top + parentWithFixedPosition[0].scrollHeight;
              distanceToBottom = parentBottom - elementBottom;
//              console.log('Расстояние до нижнего края родителя: ' + distanceToBottom);
            } else {
              const elementBottom = $dropdown.offset().top + $dropdown.outerHeight();
              const viewportBottom = $(window).scrollTop() + $(window).height();
              distanceToBottom = viewportBottom - elementBottom;
//              console.log('Расстояние до нижнего края вьюпорта: ' + distanceToBottom);
            }

          } else {
            distanceToBottom = docHeight - elementPosBottom;

//            console.log(`Расстояние от дропа ${$dropdown.parent().attr('class')} до нижней границы документа: ${distanceToBottom}px`);
          }
          let listHeight = $dropdown.find('.list').outerHeight()
          if (listHeight >= distanceToBottom && listHeight < elementPosTop) {
            $dropdown.find('.list').addClass('toTop');
          } else {
            $dropdown.find('.list').removeClass('toTop');
          }
//          console.log(`Высота дропа ${$dropdown.parent().attr('class')} = `, listHeight);
  //      }
      }
      var currentItem = $thisLang.length === 0 ? '<span class="item-with-icon"><span class="icon-select"><img src="images/icon-for-select/' + $selected.val() + '.svg" /></span>' + $selected.text() + '</span>' : '<span class="item-with-icon"><img src="images/globe.svg" class="img-select" /> ' + $selected.text() + '</span>';

      $dropdown.find('.current').html($selected.data('display') || currentItem);
      
      $options.each(function(i) {
        var $option = $(this);
        var display = $option.data('display');                
        $dropdown.find('ul').append($('<li></li>')
          .attr('data-value', $option.val())
          .attr('data-display', (display || null))
          .addClass('option' +
            ($option.is(':selected') ? ' selected' : '') +
            ($option.is(':disabled') ? ' disabled' : ''))
          .html($thisLang.length === 0 ? '<span class="item-with-icon"><span class="icon-select"><img src="images/icon-for-select/' + $option.val() + '.svg" /></span>' + $option.text() + '</span>' : $option.text())
        );
      });
      selectDirectionDrop({data: $dropdown});
      $(window).on('resize', $dropdown, selectDirectionDrop);
    }
    
    /* Event listeners */
    
    // Unbind existing events in case that the plugin has been initialized before
    $(document).off('.nice_select');
    
    // Open/close
    $(document).on('click.nice_select', '.nice-select', function(event) {
      var $dropdown = $(this);
      
      $('.nice-select').not($dropdown).removeClass('open');
      $dropdown.toggleClass('open');
      
      if ($dropdown.hasClass('open')) {
        $dropdown.find('.option');  
        $dropdown.find('.focus').removeClass('focus');
        $dropdown.find('.selected').addClass('focus');
      } else {
        $dropdown.focus();
      }
    });
    
    // Close when clicking outside
    $(document).on('click.nice_select', function(event) {
      if ($(event.target).closest('.nice-select').length === 0) {
        $('.nice-select').removeClass('open').find('.option');  
      }
    });
    
    // Option click
    $(document).on('click.nice_select', '.nice-select .option:not(.disabled)', function(event) {
      var $option = $(this);
      var $dropdown = $option.closest('.nice-select');
      var $thisLang = $dropdown.closest('.select-lang');
      $dropdown.find('.selected').removeClass('selected');
      $option.addClass('selected');
      
      var currentItem = $thisLang.length === 0 ? '<span class="item-with-icon"><span class="icon-select"><img src="images/icon-for-select/' + $option.data('value') + '.svg" /></span>' + $option.text() + '</span>' : '<span class="item-with-icon"><img src="images/globe.svg" class="img-select" /> ' + $option.text() + '</span>';
      var text = $option.data('display') || currentItem;
      $dropdown.find('.current').html(text);
      
      $dropdown.prev('select').val($option.data('value')).trigger('change');
    });

    // Keyboard events
    $(document).on('keydown.nice_select', '.nice-select', function(event) {    
      var $dropdown = $(this);
      var $focused_option = $($dropdown.find('.focus') || $dropdown.find('.list .option.selected'));
      
      // Space or Enter
      if (event.keyCode == 32 || event.keyCode == 13) {
        if ($dropdown.hasClass('open')) {
          $focused_option.trigger('click');
        } else {
          $dropdown.trigger('click');
        }
        return false;
      // Down
      } else if (event.keyCode == 40) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $next = $focused_option.nextAll('.option:not(.disabled)').first();
          if ($next.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $next.addClass('focus');
          }
        }
        return false;
      // Up
      } else if (event.keyCode == 38) {
        if (!$dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        } else {
          var $prev = $focused_option.prevAll('.option:not(.disabled)').first();
          if ($prev.length > 0) {
            $dropdown.find('.focus').removeClass('focus');
            $prev.addClass('focus');
          }
        }
        return false;
      // Esc
      } else if (event.keyCode == 27) {
        if ($dropdown.hasClass('open')) {
          $dropdown.trigger('click');
        }
      // Tab
      } else if (event.keyCode == 9) {
        if ($dropdown.hasClass('open')) {
          return false;
        }
      }
    });

    // Detect CSS pointer-events support, for IE <= 10. From Modernizr.
    var style = document.createElement('a').style;
    style.cssText = 'pointer-events:auto';
    if (style.pointerEvents !== 'auto') {
      $('html').addClass('no-csspointerevents');
    }
    
    return this;

  };

}(jQuery));