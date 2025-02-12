import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { UserAvatar } from 'app/features/user/UserAvatar'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import { useEffect, useState } from 'react'
import { cn } from 'app/lib/utils'
import { StyledLink } from 'app/design/button'



export function AvatarName({name, email, image, small, href, useRelative}) {
    const [innerName, setInnerName] = useState(name)
    const [innerEmail, setInnerEmail] = useState(email)
    const [innerImage, setInnerImage] = useState(image)

    const query = trpc.getUser.useQuery()

    const prefilled = () => {
        return (name || email || image)
    }

    const initialized = () => {
        return (innerName || innerEmail || innerImage)
    }

    useEffect(() => {
        if(!prefilled() && query && query.data) {
            setInnerName(query.data.name)
            setInnerEmail(query.data.email)
            setInnerImage(query.data.image)
        }
    }, [query?.data])

    return(
            <Skeleton colorMode="light" width={small ? 20 : "100%"} show={!initialized()}>
                {href ? (
                    <StyledLink href={href} useRelative={useRelative}>
                        <View  className={cn("flex flex-row gap-2 items-center")}>
                            <UserAvatar name={name} email={email} image={image} size={small ? 30 : 60} />
                            { !small &&
                                <Text type="H2">{innerName ?? innerEmail}</Text>
                            }
                        </View>
                    </StyledLink>
                    ) : (
                        <View  className={cn("flex flex-row gap-2 items-center")}>
                    <UserAvatar name={name} email={email} image={image} size={small ? 30 : 60} />
                    { (!small) &&
                        <Text type="H2">{innerName ?? innerEmail}</Text>
                    }
                </View>
                    )}
            </Skeleton>


    )
}