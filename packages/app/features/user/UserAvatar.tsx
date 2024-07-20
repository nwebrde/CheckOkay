import { Userpic } from 'react-native-userpic';
import { trpc } from 'app/provider/trpc-client'
import { useEffect, useState } from 'react'
import { Skeleton } from 'moti/skeleton'
export function UserAvatar({name, email, image, size = 60}) {
    const [innerName, setInnerName] = useState(name)
    const [innerEmail, setInnerEmail] = useState(email)
    const [innerImage, setInnerImage] = useState(image)

    const query = trpc.getUser.useQuery({enabled: !initialized})

    const initialized = () => {
        return (innerName || innerEmail || innerImage)
    }

    useEffect(() => {
        if(!initialized() && query && query.data) {
            setInnerName(query.data.name)
            setInnerEmail(query.data.email)
            setInnerImage(query.data.image)
        }
    }, [query?.data])

    return(
        <Skeleton colorMode="light" width={size} show={!initialized()}>
        <Userpic
            size={size}
            source={innerImage ? { uri: innerImage } : undefined}
            email={innerEmail}
            name={innerName}
            colorize={true}
            radius={20}
        />
        </Skeleton>
    )
}