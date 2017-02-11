import expander from '../scripts/expander'
import chai from 'chai'

const expect = chai.expect

describe('expander', () => {
  it('should expand delta to md', () => {
    let delta = {
      ops: [
        {
          attributes: { bold : true },
          insert : "Open your"
        },
        { insert: '\n' }
      ]
    }
    
    let md = expander(delta)
    expect(md).to.equal('**Open your**\n')
  })
  
  it('should expand image delta', () => {
    let delta = {
      ops: [
        {
          insert: {
            image: {
              alt: 'image',
              url: 'http://somewhere.com/a.jpg'
            }
          }
        },
        { insert: '\n' }
      ]
    }
    
    let md = expander(delta)
    expect(md).to.equal('![image](http://somewhere.com/a.jpg)\n')
  });
})


