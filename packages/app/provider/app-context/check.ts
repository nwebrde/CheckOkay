import {trpc} from "app/provider/trpc-client";
import Check from "app/provider/app-context/types/check";

export function addCheck(setChecks: (checks: Check[]) => void, checks: Check[], hour: number, minute: number) {
    const checkId = trpc.checks.addCheck.useAs


    checks.push([{
        checkId:
        hour:
        minute:
    }])
    setChecks((checks.push({

    }))
}