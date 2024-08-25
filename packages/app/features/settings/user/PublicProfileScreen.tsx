import Screen from 'app/design/screen'
import { SettingsGroup } from 'app/design/settings/group'
import { SettingsRow } from 'app/design/settings/row'
import React, { useEffect, useState } from 'react'
import { AvatarName } from 'app/features/user/AvatarName'
import { Input } from 'app/design/input'
import { HeaderLink } from 'app/design/settings/HeaderLink'
import { Photo, Trash, XMark } from 'app/design/icons'
import * as ImagePicker from 'expo-image-picker';
import { trpc } from 'app/provider/trpc-client'
import { ActivityIndicator, TextInput } from 'react-native'
import { View } from 'app/design/view'
import { DismissKeyboardView } from 'app/design/keyboardDismisser/KeyboardDismisser'
import { Text } from 'app/design/typography'


const getBlob = async (fileUri) => {
    const resp = await fetch(fileUri);
    const imageBody = await resp.blob();
    return imageBody;
};

const uploadImage = async (uploadUrl, data) => {
    const imageBody = await getBlob(data);
    return fetch(uploadUrl, {
        method: "PUT",
        body: imageBody,
    });
};

const Header = ({loading}) => {
    if(loading) {
        return <ActivityIndicator />
    }
    return( <View className="flex flex-row gap-6">

            </View>
        )
}

export function PublicProfileScreen() {
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [nameLoading, setNameLoading] = useState(false);
    const [name, setName] = useState("");
    const [nameEditing, setNameEditing] = useState(false);

    const getUploadUrl = trpc.user.getUploadUrl.useMutation()
    const updateProfileImage = trpc.user.setProfileImage.useMutation()
    const deleteProfileImage = trpc.user.deleteProfileImage.useMutation()
    const setUserName = trpc.user.setName.useMutation()
    const userQuery = trpc.getUser.useQuery()

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            selectionLimit: 1
        });

        if (!result.canceled) {
            const pickedImageUri = result.assets[0]?.uri
            if (pickedImageUri) {
                setLoading(true)
                const uploadMetaData = await getUploadUrl.mutateAsync()
                await uploadImage(uploadMetaData.uploadUrl, pickedImageUri)
                await updateProfileImage.mutateAsync({
                    key: uploadMetaData.key
                })
                setLoading(false)
            }

        }
    };

    const changeName = async () => {
        setNameLoading(true)
        await setUserName.mutateAsync({
            name: name
        })
        setNameLoading(false)
        setNameEditing(false)
    }

    const deleteImage = async () => {
        setDeleteLoading(true)
        await deleteProfileImage.mutateAsync()
        setDeleteLoading(false)
    }

    useEffect(() => {
        if(userQuery.data && userQuery.data.name) {
            setName(userQuery.data.name)
        }
    }, [userQuery.data])

    return(
        <Screen width="max-w-xl">
            <DismissKeyboardView>
                <View className="flex flex-col gap-2 mb-3">
                    <AvatarName />
                    <Text>
                        So sehen dich deine Beschützer
                    </Text>
                </View>
                <SettingsGroup>
                    {
                        /*
                                        <SettingsRow headerChild={<Input className="min-w-full w-full" value={userQuery.data?.name} />} separator={true} label="Name" description="Gebe einen Namen an, der deinen Beschützern angezeigt werden soll" />
                         */
                    }
                    <SettingsRow headerChild={nameLoading ? <ActivityIndicator /> : (nameEditing ? <HeaderLink title="Speichern" icon={<></>} /> : <></>)} separator={true} label="Name" description="Gebe einen Namen an, der deinen Beschützern angezeigt werden soll">
                        <Input className="min-w-full w-full" value={name} onChangeText={setName} onFocus={() => setNameEditing(true)} onBlur={changeName} />
                    </SettingsRow>
                    <SettingsRow onPress={pickImage} linkIcon={loading ? <ActivityIndicator /> : <Photo className="stroke-2 text-primary" />} separator={userQuery.data?.image != undefined} label="Neues Profilbild auswählen" description="Wähle ein Profilbild aus, damit dich deine Beschützer leichter erkennen" />
                    {(userQuery.data?.image) &&
                        <SettingsRow linkIcon={deleteLoading ? <ActivityIndicator /> : <Trash className="stroke-2 text-primary" />} label="Profilbild löschen" separator={false} onPress={deleteImage} />
                    }
                </SettingsGroup>
            </DismissKeyboardView>
        </Screen>
    )
}