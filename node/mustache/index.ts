import { parse } from 'mustache'

const normalTagInput = '{{ item.name }}'

let spans = parse(normalTagInput)
console.log(spans)
if (spans.length > 1) {
  throw new Error("placeholder must be one or less");
} else if (spans.length === 1 && spans[0][0] === 'name') { // `spans[0][0] === 'name'` means placeholder extraction succeeds
  const placeHolderName = spans[0][1]

  console.log(placeHolderName)
}

const customTagInput = '<% item %>'
spans = parse(customTagInput, ['<%', '%>'])
console.log(spans)
if (spans.length > 1) {
  throw new Error("placeholder must be one or less");
} else if (spans.length === 1 && spans[0][0] === 'name') {
  const placeHolderName = spans[0][1]

  console.log(placeHolderName)
}
