import expandDelta from '../scripts/expandDelta'
import chai from 'chai'

const expect = chai.expect

describe('expandDelta', () => {
  it('should expand delta to md', () => {
    let delta = {
      ops: [
        {
          "attributes": {"bold": true},
          "insert": "Open your"
        },
        { insert: '\n' }
      ]
    }
    
    let md = expandDelta(delta)
    expect(md).to.equal('**Open your**\n')
  })
})


