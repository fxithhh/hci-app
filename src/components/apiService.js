// apiService.js

import axios from 'axios';

export async function findPlaces(service, request) {
    return new Promise((resolve, reject) => {
        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                resolve(results);
            } else {
                reject('No results found or an error occurred.');
            }
        });
    });
}

export async function searchCarparkInfo(service, request) {
    return new Promise((resolve, reject) => {
        service.textSearch(request, (results, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results.length > 0) {
                resolve(results);
            } else {
                reject('No results found or an error occurred.');
            }
        });
    });
}
