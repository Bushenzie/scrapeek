import { useQuery } from "@tanstack/react-query"
import { type Dispatch, type FC, type SetStateAction, useState } from "react"

import { MultiSelect } from "@/components/ui/multi-select/multi-select"
import type { Option } from "@/types/common"
import { groupsListOptions } from "../api/groups.queries"

type SelectGroupsProps = {
  value: Option[]
  setValue: Dispatch<SetStateAction<Option[]>>
}

export const SelectGroups: FC<SelectGroupsProps> = ({ value, setValue }) => {
  const { data: groups } = useQuery(groupsListOptions())

  return (
    <MultiSelect
      label={"Groups"}
      options={(groups?.data ?? [])?.map((group) => ({ label: group.name, value: group.id }))}
      value={value}
      onChange={(opt) => setValue(opt)}
    />
  )
}
