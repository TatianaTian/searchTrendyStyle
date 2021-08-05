
import React, {useContext} from 'react';
import SigninContext from '../context/SigninContext'

class LanguageSwitcher extends React.Component {
    render() {
      return (
        <SigninContext.Consumer>
          {({ signin, pay, setValue }) => (
            <button onClick={() => {
                setValue(true, true)
            }
            }>
              Switch signin (Current: {signin})
            </button>

          )}
        </SigninContext.Consumer>
      );
    }
  }
export default LanguageSwitcher;
 