import { type FC } from 'react'
import type { Option } from '@/types/common'
import { Combobox, ComboboxChip, ComboboxChips, ComboboxChipsInput, ComboboxContent, ComboboxEmpty, ComboboxItem, ComboboxList, ComboboxValue } from '../combobox-core/combobox-core'
import { useComboboxAnchor } from '../combobox-core/combobox-core.hooks'
import { Label } from '../label/label'
import type { MultiSelectProps } from './multi-select.types'


export const MultiSelect: FC<MultiSelectProps> = ({options,label,notFoundText = "No items found.",placeholder = "Add option", value, onChange}) => {
  const anchor = useComboboxAnchor()

  return (
      <Combobox
      items={options}
      itemToStringValue={(opt: Option) => String(opt.value)}
      itemToStringLabel={(opt: Option) => opt.label}
      value={value}
      onValueChange={onChange}
      multiple
    >
      <div className="flex flex-col gap-2 w-full">
        {label && <Label>{label}</Label>}
        <ComboboxChips ref={anchor} className="w-full">
          <ComboboxValue>
            {value?.map((itemValue) => {

              // TODO: why is the value here string and not Option even if it is typed as Option?
              const option = options.find(opt => opt.value === itemValue as unknown as string);

              if (!option) return null;

              return(
              <ComboboxChip key={String(option.value)}>{option.label}</ComboboxChip>
            )})}
          </ComboboxValue>
          <ComboboxChipsInput placeholder={placeholder} />
        </ComboboxChips>
      </div>
      <ComboboxContent >
        <ComboboxEmpty>{notFoundText}</ComboboxEmpty>
        <ComboboxList >
          {(item) => {
            return (
              <ComboboxItem key={String(item.value)} value={item.value}>
                {item.label}
              </ComboboxItem>
          )}}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
