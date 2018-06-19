/*
 * JBoss, Home of Professional Open Source
 * Copyright 2013, Red Hat, Inc. and/or its affiliates, and individual
 * contributors by the @authors tag. See the copyright.txt in the
 * distribution for a full listing of individual contributors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Define the REST resource service, allowing us to interact with it as a high level service
angular.module('otrService', ['ngResource']).
    factory('OTRAudioData', function($resource){
  return $resource('/otr-audio-data/rest/:method/:id', {method: '@_method', id: '@_id'});
    }).factory('OTRAudioDataCount', function($resource){
	  return $resource('/otr-audio-data/rest/resultsCount/:id', {id: '@_id'});
	}).factory('OTRSeriesData', function($resource){
	  return $resource('/otr-series-data/rest/:method/:id', {method: '@_method', id: '@_id'});
	}).factory('OTRSeriesDataCount', function($resource){
	  return $resource('/otr-series-data/rest/resultsCount/:id', {id: '@_id'});
	}).factory('OTREpisodeData', function($resource){
	  return $resource('/otr-episode-data/rest/:method/:id', {method: '@_method', id: '@_id'});
	}).factory('OTREpisodeDataCount', function($resource){
	  return $resource('/otr-episode-data/rest/resultsCount/:id', {id: '@_id'});
	}).factory('OTRFileServices', function($resource){
	  return $resource('/otr-file-services/rest/:method/:id', {method: '@_method', id: '@_id'});
	});

