const TokenType = require('./TokenType')
const Token = require('./Token')
const Keywords = require('./Keywords')
const {log, level, logError} = require('./log')

class Scanner {

  constructor(source) {
    this.source = source
    this.tokens = []
    this.start = 0
    this.current = 0
    this.line = 1
  }

  scanTokens() {
    while (!this._isAtEnd()) {
      this.start = this.current
      this._scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return this.tokens
  }

  _scanToken() {
    const c = this._advance() // Move curr++ and return curr - 1
    switch (c) {
      case '(': this._addToken(TokenType.LEFT_PAREN)
        break
      case ')': this._addToken(TokenType.RIGHT_PAREN)
        break
      case '{': this._addToken(TokenType.LEFT_BRACE)
        break
      case '}': this._addToken(TokenType.RIGHT_BRACE)
        break
      case ',': this._addToken(TokenType.COMMA)
        break
      case '.': this._addToken(TokenType.DOT)
        break
      case '-': this._addToken(TokenType.MINUS)
        break
      case '+': this._addToken(TokenType.PLUS)
        break
      case ';': this._addToken(TokenType.SEMICOLON)
        break
      case '*': this._addToken(TokenType.STAR)
        break
      case '!': this._addToken(this._match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break      
      case '=': this._addToken(this._match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
        break    
      case '<': this._addToken(this._match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>': this._addToken(this._match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break
      case '"': this._string()
        break
      case '/':                                                       
        if (this._match('/')) {
          // A comment goes until the end of the line.                
          while (this._peek() !== '\n' && !this._isAtEnd())
            this._advance()
        } else if (this._match('*')) {
          // Multiline comment block goes until */ is found
          let err = false
          while (this._peek() !== '*' && this._peekNext() !== '/') {
            this._advance()
            if (this._isAtEnd()) {
              err = true
              logError(this.line, '', 'Unterminated comment block.')
              break
            }
          }
          if (!err) {
            this._advance() // skip * char
            this._advance() // skip / char
          }
        } else {
          this._addToken(TokenType.SLASH)
        }
        break
      case ' ':                                    
      case '\r':                                   
      case '\t':                                   
        // Ignore whitespace.                      
        break
      case '\n':                                   
        this.line++                                    
        break
      default:
        if (this._isDigit(c)) {
          this._number()
        } else if (this._isAlpha(c)) {
          this._identifier()
        } else {
          logError(this.line, '', `Unexpected character: ${c}`)
        }
        break
    }
  }

  _peek() {
    if (this._isAtEnd())
      return '\0'
    return this.source.charAt(this.current)
  }

  _peekNext() {
    if (this.current + 1 >= this.source.length)
      return '\0'
    return this.source.charAt(this.current + 1)
  }

  _match(expected) {
    if (this._isAtEnd() || this.source.charAt(this.current) !== expected) 
      return false

    this.current++
    return true
  }
  
  _advance() {                               
      this.current++
      return this.source.charAt(this.current - 1)
   }

  _addToken(type) {
    this._addToken(type, null)
  }

  _addToken(type, literal) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  _isAtEnd() {
    return this.current >= this.source.length
  }

  _string() {
    while (this._peek() != '"' && !this._isAtEnd()) {
      if (this._peek() == '\n') 
        this.line++
      
      this._advance()
    }
    // Unterminated string.
    if (this._isAtEnd()) {
      logError(this.line, '', 'Unterminated string.')
      return
    }

    // The closing ".
    this._advance()

    // Fetch character sequence between quotes
    const value = this.source.substring(this.start + 1, this.current - 1)
    this._addToken(TokenType.STRING, value)
  }

  _number() {
    while (this._isDigit(this._peek()))
      this._advance()

    // Look for fractional part.
    if (this._peek() == '.' && this._isDigit(this._peekNext())) {
      // Consume the "."
      this._advance()

      while (this._isDigit(this._peek()))
        this._advance()
    }

    const strNum = this.source.substring(this.start, this.current)
    this._addToken(TokenType.NUMBER, parseFloat(strNum))
  }

  _identifier() {
    while (this._isAlphaNumberic(this._peek())) 
      this._advance()

    const text = this.source.substring(this.start, this.current)
    let type = Keywords[text]
    if (type == null)
      type = TokenType.IDENTIFIER

    this._addToken(type)
  }

  _isAlpha(c) {
    return  (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            (c === '_')
  }

  _isDigit(c) {
    return c >= '0' && c <= '9'
  }

  _isAlphaNumberic(c) {
    return this._isAlpha(c) || this._isDigit(c)
  }
}

module.exports = Scanner