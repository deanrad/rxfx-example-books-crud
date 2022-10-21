import { useService } from "@rxfx/react";
import React, { useState } from "react";
import { addService } from "../Shared/BooksService";

export default function AddBooksComponent() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const { isActive } = useService(addService);

  return (
    <div>
      <h5>Add Book (api) {isActive ? "⏳" : ""}</h5>
      name : <br /> <input onKeyUp={(e) => setName(e.target.value)} />
      <br /> author : <br />{" "}
      <input onKeyUp={(e) => setAuthor(e.target.value)} />
      <br />
      <button
        onClick={() => {
          addService.request({ name, author });
        }}
      >
        add book
      </button>
    </div>
  );
}
