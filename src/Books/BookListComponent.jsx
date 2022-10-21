import React, { useState, useEffect } from "react";
import { useService, useWhileMounted } from "@rxfx/react";
import { loadService } from "../Shared/BooksService";

export default function BookListComponent() {
  // const [books, setBooks] = useState([]);

  const { state: books, isActive, request } = useService(loadService);

  useWhileMounted(() => {
    request();
    // if we are cancelable, we should cancel.. The Network
    // will show an initial canceled load and then subsequent
    // full load - which is good.
    return () => {
      loadService.cancelCurrent();
    };
    // If we're not cancelable, we re-request, but
    // the blocking mode means we piggy-back off the original
  });

  return (
    <div>
      <h5 className="book-list-title">
        Book List (api)
        {isActive ? "⏳" : ""}
        {/* hide when recieving updates continually */}
      </h5>
      <div>
        {books.map((book, i) => {
          return <div key={i}>{book.name}</div>;
        })}
      </div>
    </div>
  );
}
