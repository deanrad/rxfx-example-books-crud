import React, { useState, useEffect } from "react";
import { useService, useWhileMounted } from "@rxfx/react";
import { addService, BOOKS } from "../Shared/BooksService";
import { bus } from "../Shared/bus";

export default function StatsComponent() {
  const [book, setBook] = useState({});
  useWhileMounted(() =>
    // 1. Listen to the add service response
    // addService.responses.subscribe(({ payload: book }) => setBook(book))
    // 1. Optimistically isten to the add service request
    bus
      .query(addService.actions.request.match)
      .subscribe(({ payload: book }) => setBook(book))
  );
  // useEffect(() => {
  //   statsPresenter.load(generatedViewModel => {
  //     copyViewModelToStateViewModel(generatedViewModel);
  //   });
  // }, []);

  return (
    <div>
      <h5>Last Added Book (ui)</h5>
      {book.name}
    </div>
  );
}
