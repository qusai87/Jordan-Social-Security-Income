/*!
 *
 *  Web Starter Kit
 *  Copyright 2015 Google Inc. All rights reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License
 *
 */
/* eslint-env browser */
(function($, Handlebars) {
  'use strict';

  var source = $('#entry-template').html();
  var template = Handlebars.compile(source);

  // Check to make sure service workers are supported in the current browser,
  // and that the current page is accessed from a secure origin. Using a
  // service worker from an insecure origin will trigger JS console errors. See
  // http://www.chromium.org/Home/chromium-security/prefer-secure-origins-for-powerful-new-features
  var isLocalhost = Boolean(window.location.hostname === 'localhost' ||
      // [::1] is the IPv6 localhost address.
      window.location.hostname === '[::1]' ||
      // 127.0.0.1/8 is considered localhost for IPv4.
      window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
      )
    );

  if ('serviceWorker' in navigator &&
      (window.location.protocol === 'https:' || isLocalhost)) {
    navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      // updatefound is fired if service-worker.js changes.
      registration.onupdatefound = function() {
        // updatefound is also fired the very first time the SW is installed,
        // and there's no need to prompt for a reload at that point.
        // So check here to see if the page is already controlled,
        // i.e. whether there's an existing service worker.
        if (navigator.serviceWorker.controller) {
          // The updatefound event implies that registration.installing is set:
          // https://slightlyoff.github.io/ServiceWorker/spec/service_worker/index.html#service-worker-container-updatefound-event
          var installingWorker = registration.installing;

          installingWorker.onstatechange = function() {
            switch (installingWorker.state) {
              case 'installed':
                // At this point, the old content will have been purged and the
                // fresh content will have been added to the cache.
                // It's the perfect time to display a "New content is
                // available; please refresh." message in the page's interface.
                break;

              case 'redundant':
                throw new Error('The installing ' +
                                'service worker became redundant.');

              default:
                // Ignore
            }
          };
        }
      };
    }).catch(function(e) {
      console.error('Error during service worker registration:', e);
    });
  }

  // Your custom JavaScript goes here

  $('input').on('change keyup', function() {
    var avgIncome = parseInt($('#gross-income').val())*36/36;
    var retirementLength = parseInt($('#retirement-length').val());
    var age = parseInt($('#age').val());
    var service_years = Math.round(retirementLength / 12);
    var sex = $('.is-checked [name=sex]').val()

    $('.result-note').html('');
    $('.result-body').html('');
    $('.result-error').html('');
    $('.result-error-desc').html('');

    if (retirementLength<180) {
      $('.result-error').text('مدة الخدمة للتقاعد غير كافية!');
      $('.result-error-desc').append('<p>(عدد الاشتراكات يجب ان تكون (180) اشتراكاً على الأقل منها (60) اشتراكاً فعلياً)');
    }
    //var results = (avgIncome*retirementLength*1.25)/360;
    if (sex == '1') {
      if (age<60) {
        age = 60-age;
      } else {
        age = 0;
      }
    }

    if (sex == '2') {
      if (age<55) {
        age = 55-age;
      } else {
        age = 0;
      }
    }

    var current_pension = Math.round(Math.min(avgIncome * 2.5/100 * service_years, avgIncome*75/100));
    var expected_pension = Math.round(Math.min(avgIncome * 2.5/100 * (service_years+age), avgIncome*75/100));

    var expected_retirement = (service_years+age)*12;

    var context = {
      average_income: avgIncome, 
      current_pension: current_pension,  
      expected_pension: expected_pension,  
      service_years : service_years, 
      expected_retirement: expected_retirement,
      age: age 
    };

    var html = template(context);

    if (avgIncome && retirementLength && age) {
      $('.result-body').html(html);
      $('.result-note').append('<p>** يرجى العلم ان هذه الحسابات غير رسمية ويمكن ان تكون غير دقيقة</p>');
    }
  });

})(window.jQuery,window.Handlebars);
