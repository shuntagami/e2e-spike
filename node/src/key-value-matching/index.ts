const indexMemo: Map<string, number> = new Map<string, number>

const incrementIndex = (key: string): void => {
  const currentIndex = indexMemo.get(key)
  if (currentIndex !== undefined) {
    indexMemo.set(key, currentIndex + 1)
    resetChildrenIndex(key)
  } else {
    indexMemo.set(key, 0)
  }
}

const resetChildrenIndex = (key: string): void => {
  for (const [k, _] of indexMemo) {
    if (key.length < k.length) {
      for (let i = 0; i < key.length; i++) {
        if (key[i] !== k[i]) break
      }
      indexMemo.set(k, 0)
    }
  }
}

// find value along the rules from json user defined
const findValue = (r: object, keyStr: string): string => {
  const keys = keyStr.split('.')

  let currentVal: unknown = r

  let i = 0
  while (i < keys.length) {
    if (typeof currentVal === 'object' && currentVal !== null) {
      if (currentVal instanceof Array) {
        const currentKeyStr = keys.slice(0, i).join('.')
        const currentIndex = indexMemo.get(currentKeyStr)
        if (currentIndex === undefined) {
          incrementIndex(currentKeyStr)
          currentVal = currentVal[0]
        } else {
          currentVal = currentVal[currentIndex]
        }
      } else {
        const k = keys[i]
        currentVal = currentVal[k as keyof typeof currentVal]
        i++
      }
    } else {
      break
    }
  }

  if (typeof currentVal === 'string') {
    return currentVal
  } else if (typeof currentVal === 'number') {
    return currentVal.toString()
  } else {
    return ''
  }
}

const main = () => {
  // available input json value type: string, number, object, array
  const resource: object = {
    key1: 'string',
    key2: 10,
    items: [
      {
        k1: '1',
        k2: 'value1',
        obj: {
          k1: 'foo',
          k2: 'v',
          items2: [
            {
              k1: 'a'
            },
            {
              k1: 'b'
            }
          ]
        },
      },
      {
        k1: '1',
        k2: 'value2',
        obj: {
          k1: 'bar',
          k2: 'v',
          items2: [
            {
              k1: 'c'
            },
            {
              k1: 'd'
            }
          ]
        }
      },
    ]
  }

  console.log(findValue(resource, 'key2'))
  console.log(findValue(resource, 'items.k2'))
  console.log(findValue(resource, 'items.obj.k1'))
  console.log(findValue(resource, 'items.obj.items2.k1'))

  console.log(indexMemo)
  incrementIndex('items.obj.items2')
  console.log(indexMemo)

  console.log(findValue(resource, 'items.obj.items2.k1'))

  incrementIndex('items')
  console.log(indexMemo)

  console.log(findValue(resource, 'key2'))
  console.log(findValue(resource, 'items.k2'))
  console.log(findValue(resource, 'items.obj.k1'))
  console.log(findValue(resource, 'items.obj.items2.k1'))

  incrementIndex('items.obj.items2')
  console.log(findValue(resource, 'items.obj.items2.k1'))
  incrementIndex('items.obj.items2')
  console.log(findValue(resource, 'items.obj.items2.k1'))
}

main()
