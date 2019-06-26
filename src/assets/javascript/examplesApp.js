(function() {
                
        var examplesApp = angular.module('examplesApp', [],
          function($interpolateProvider) {
            $interpolateProvider.startSymbol('[[').endSymbol(']]');
        });
                  
        examplesApp.controller('examplesController', function($scope,$sce){                                                 
          
          $scope.tagFilters = {"All":true ,"JQuery":false,"Backbone":false,"Node.js":false,"D3.js":false,"WinJs":false,"MongoDB":false,"Express":false};
          
          $scope.updateFilter = function () {                                
                if($(".tagFilters").length == $(".tagFilters:not(:checked)").length) {
                        $scope.tagFilters.All = true;                           
                } else {
                        $scope.tagFilters.All = false;
                }
          };                  
                                               
          $scope.examples = [
            {'title': 'Hello World',
             'summary': 'Ground-floor example of types and classes',
             'description': '<p>This sample shows basic class definition and instantiation.</p>',
             'img': '/assets/images/examples/greeter_400x300.png',
             'tags':["All"],              
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/greeter',
             'src': '#1'},
            {'title': 'Raytracer',
             'summary': 'An implementation of TypeScript-based raytracer',
             'description': '<p>This sample implements a DOM canvas-based raytracer.  Notable features include:</p><ul><li>Use of the DOM Canvas</li><li>Use of a wide range of TypeScript language features including interfaces, classes, modules, accessibility modifiers, and casts</li></ul>',
             'img': '/assets/images/examples/raytracer_400x300.png',
             'tags':["All"],              
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/raytracer',
             'src': '#2'},             
            {'title': 'TodoMVC',
             'summary': 'A TypeScript version of the class TodoMVC using Backbone.js and jQuery',
             'description': '<p>This sample shows an implementation of the Backbone.js TODO sample derived from <a href="https://github.com/addyosmani/todomvc" target="_blank">https://github.com/addyosmani/todomvc</a>.  The following TypeScript integration points are highlighted:</p><ul><li><strong>Backbone.js</strong>: Using TypeScript classes to create Backbone models and views</li><li><strong>jQuery</strong>: Using jQuery for all DOM manipulation</li></ul>',
             'img': '/assets/images/examples/todomvc_400x300.png',
             'tags':['JQuery','Backbone',"All"],              
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/todomvc',
             'src': '#3'},
            {'title': 'ImageBoard',
             'summary': 'A Node.js + Express + MongoDB application built using TypeScript on the server',
             'description': '<p>This sample implements a complete Node.js application.  Notable features include:</p><ul><li>Typed usage of Express for server-side MVC</li><li>Typed usage of MongoDB for server-side database access</li><li>Typed usage of Node.js</li><li>Use of TypeScript module syntax targeting the Node.js module system</li><li>Visual Studio project file for working with the project</li></ul>',
             'img': '/assets/images/examples/imageboard_400x300.png',
             'tags':['Node.js','Express','MongoDB',"All"],              
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/imageboard',
             'src': '#4'},             
            {'title': 'JQuery Parallax Starfield',
             'summary': 'A JQuery application built to show simple JQuery usage',
             'description': '<p>This sample implements a small JQuery application.  Notable features include:</p><ul><li>Typed usage of JQuery</li></ul>',
             'img': '/assets/images/examples/jquery_400x300.png',
             'tags':['JQuery',"All"],               
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/jquery',
             'src': '#5'},
            {'title': 'D3 Visualization',
             'summary': 'An application built to show use of D3 and canvas-based visualization',
             'description': '<p>This sample implements a small D3 visualization.  Notable features include:</p><ul><li>Typed usage of D3</li><li>Use of the DOM Canvas</li></ul>',
             'img': '/assets/images/examples/d3_400x300.png',
             'tags':['D3.js',"All"],              
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/d3',
             'src': '#6'},             
            {'title': 'Warship Combat',
             'summary': 'A full battleship-clone',
             'description': '<p>This sample implements a full game using JQuery and JQuery UI.  Notable features include:</p><ul><li>Typed usage of JQuery and JQuery UI</li><li>Use of getters/setters</li><li>Use of traditional OO code design, including access modifiers</li></ul>',
             'img': '/assets/images/examples/warship_400x300.png',
             'tags':['JQuery',"All"],
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/warship',
             'src': '#7'},
            {'title': 'Encyclopedia App',
             'summary': 'A complete Windows 8 Store application built with HTML, CSS, and TypeScript',
             'description': '<p>The encyclopedia includes a complete sample of a Windows 8 Store application built using TypeScript.  The following features of TypeScript are highlighted:</p><ul><li><strong>Visual Studio project integration</strong>: TypeScript compilation integrated into Visual Studio\'s build system</li><li><strong>Typing WinJS and the Windows Runtime</strong>: Early work shown typing these libraries</li><li><strong>Mostly JavaScript in TypeScript</strong>: Code is mostly the original JavaScript, with a little TypeScript</li><li><strong>DOM types</strong>: Mix of strongly-typed and weakly-typed DOM manipulation</li></ul>',
             'tags':['Windows Store Apps','WinJs',"All"],
             'git': 'https://github.com/Microsoft/TypeScriptSamples/tree/master/win8.1',
             'img': '/assets/images/examples/win8_400x300.png',
             'src': '#8'},                              
          ];      
        });
                  
        // html filter (render text as html)
        examplesApp.filter('htmlFilter', ['$sce', function ($sce) { 
            return function (text) {
                return $sce.trustAsHtml(String(text));
            };
        }])
        
        //examples tag filter
        examplesApp.filter('byTags', function () {
            return function (examples, tags) {
                var items = {
                    tags: tags,
                    out: []
                };
                angular.forEach(examples, function (value, key) {                                                              
                    var addExample = true;                        
                    for(var x=0; x<value.tags.length; x++)
                    {
                        if (this.tags[value.tags[x]] === true)
                        {
                            for(var z=0; z<this.out.length; z++)
                            {
                                if(value.title === this.out[z].title)
                                {
                                    addExample = false;   
                                }                                    
                            }
                            if(addExample){
                                this.out.push(value);
                                addExample = true;
                            }
                        }
                    } 
                }, items);
                return items.out;
            };
        });                                                        
})();