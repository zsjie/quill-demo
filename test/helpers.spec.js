import { expect } from 'chai'
import { mergeOps } from '../scripts/marker/helpers'

describe('helpers', () => {
  describe('mergeOps', () => {
    it('should merge ops which have no attributes', () => {
      let ops = [
        { insert: '\n' },
        { insert: 'a' },
        { insert: '\n', attributes: {} },
        { insert: 'b\n' },
        { insert: 'c\n' },
        { insert: 'd' },
        { insert: '\n', attributes: {} },
      ]
      let merged = [
        { insert: '\na' },
        { insert: '\n', attributes: {} },
        { insert: 'b\nc\nd' },
        { insert: '\n', attributes: {} },
      ]
      expect(mergeOps(ops)).to.eql(merged)
    })
  })
})
