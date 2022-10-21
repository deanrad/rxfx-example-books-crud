import { after } from "@rxfx/after";
import { concat, from, merge, Observable, EMPTY } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { ajax } from "rxjs/ajax";
import {
  createCollectionEvents,
  createBlockingService,
  createQueueingService
} from "@rxfx/service";
import { bus } from "./bus";

export const BOOKS = createCollectionEvents("books");

export const addService = createQueueingService("books/post", bus, (book) =>
  after(1500, book)
);

const mocks = [
  { name: "Doctors", author: "Dean" },
  { name: "Friends", author: "Miles" },
  { name: "Boys", author: "Paul" }
];

export const loadService = createBlockingService(
  "books/load",
  bus,
  // Try the following implementations
  // Assume books come in individually at once - Observable<book>
  // allAtEndObservable,
  // observableReducer
  // // Assume books come in individually incremental - Observable<book>
  incrementalObservable,
  observableReducer
  // Or a legacy all-at-end style as the norm - Promise<book[]>
  // promisedArray,
  // promisedArrayReducer
  // Or Observable Wtih a tracking ajax
  // allAtEndObservableWithAjax,
  // observableReducer
  // Or Promise With tracking Ajax
  // promisedArrayWithAjax,
  // promisedArrayReducer
  // Experimental: with realtime updates from adds (should hide isActive all time)
  // withSuccessfulAdds,
  // observableReducer
);

// Try the following implementations

function incrementalObservable() {
  return concat(...mocks.map((m) => after(1000, m)));
}
function withSuccessfulAdds() {
  return concat(
    incrementalObservable(),
    addService.responses.pipe(map(({ payload: book }) => book))
  );
}

function allAtEndObservable() {
  return after(2000, from(mocks));
}
function promisedArray() {
  return after(2000, mocks);
}
function allAtEndObservableWithAjax() {
  return merge(
    after(2000, from(mocks)),
    ajax.getJSON("https://httpbin.org/delay/2").pipe(mergeMap(EMPTY))
  );
}
function promisedArrayWithAjax() {
  fetch("https://httpbin.org/delay/2");
  return after(2000, mocks);
}

function promisedArrayReducer(PEs) {
  return (state = [], e = {}) => {
    if (PEs.next.match(e)) {
      return e.payload;
    }
    return state;
  };
}
function observableReducer(PEs) {
  return (state = [], e = {}) => {
    if (PEs.next.match(e)) {
      return [...state, e.payload];
    }
    return state;
  };
}
