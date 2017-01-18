import expandDelta from '../scripts/expandDelta'

const expect = require('chai').expect

describe('expandDelta', () => {
  it('should expand delta to md', () => {
    let delta = {
      ops: [
        {
          "attributes": {"bold": true},
          "insert": "Open your "
        }
      ]
    }
    
    let md = expandDelta(delta)
    expect(md).to.equal('**Open your **')
  })
})
