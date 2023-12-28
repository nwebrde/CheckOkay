import { Text } from 'react-native'
import {trpc} from "./client";


export const Welcome = () => {
    const hello = trpc.hello.useQuery({text: "myApp"})

    // if (user.error) console.error(user.error);
    if (hello.data == null) return (<><Text>loading...</Text></>)
    return <Text>{hello.data.greeting}</Text>
}