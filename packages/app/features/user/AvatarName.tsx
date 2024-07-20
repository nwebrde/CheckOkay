import { View } from 'app/design/view'
import { Text } from 'app/design/typography'
import { UserAvatar } from 'app/features/user/UserAvatar'
import { trpc } from 'app/provider/trpc-client'
import { Skeleton } from 'moti/skeleton'
import { useEffect, useState } from 'react'
import { cn } from 'app/lib/utils'
import { StyledLink } from 'app/design/button'

const Inner = ({name, email, image, small}) => {
    <View  className={cn("flex flex-row gap-2 items-center")}>
        <UserAvatar size={small ? 30 : 60} name={name} email={email} image={image} />
        { !small &&
            <Text type="H2">{name ?? email}</Text>
        }
    </View>
}

export function AvatarName({name, email, image, small, href, useRelative}) {
    const [innerName, setInnerName] = useState(name)
    const [innerEmail, setInnerEmail] = useState(email)
    const [innerImage, setInnerImage] = useState(image)

    const query = trpc.getUser.useQuery()

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
            <Skeleton colorMode="light" width={small ? 20 : "100%"} show={!initialized()}>
                {href &&
                <StyledLink href={href} useRelative={useRelative}>
                    <Inner name={innerName} email={innerEmail} image={innerImage} small={small} />
                </StyledLink>
                }
                {!href &&
                    <Inner name={innerName} email={innerEmail} image={innerImage} small={small} />
                }
            </Skeleton>
    )
}