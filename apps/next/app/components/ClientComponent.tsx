"use client"

import styles from "../../styles/index.module.css";
import {trpc} from "../_trpc/client";
import {Button} from "app/design/button";
export default function ClientComponent() {
    const hello = trpc.hello.useQuery({text: "sss"});
    if (!hello.data) {
        return <div>Loading...</div>;
    }
  return (
    <div className={styles.container}>
      <h1>{hello.data.greeting}</h1>
      <Button onClick={() => console.log("Pressed!")} text="Boop" />
    </div>
  );
}
