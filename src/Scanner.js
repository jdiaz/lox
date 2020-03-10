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
    while (!this.isAtEnd()) {
      this.start = this.current
      this.scanToken()
    }

    this.tokens.push(new Token(TokenType.EOF, '', null, this.line))
    return this.tokens
  }

  scanToken() {
    const c = this.advance() // Move curr++ and return curr - 1
    switch (c) {
      case '(': this.addToken(TokenType.LEFT_PAREN)
        break
      case ')': this.addToken(TokenType.RIGHT_PAREN)
        break
      case '{': this.addToken(TokenType.LEFT_BRACE)
        break
      case '}': this.addToken(TokenType.RIGHT_BRACE)
        break
      case ',': this.addToken(TokenType.COMMA)
        break
      case '.': this.addToken(TokenType.DOT)
        break
      case '-': this.addToken(TokenType.MINUS)
        break
      case '+': this.addToken(TokenType.PLUS)
        break
      case ';': this.addToken(TokenType.SEMICOLON)
        break
      case '*': this.addToken(TokenType.STAR)
        break
      case '!': this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG)
        break      
      case '=': this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL)
        break    
      case '<': this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS)
        break
      case '>': this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER)
        break
      case '"': this.string()
        break
      case '/':                                                       
        if (this.match('/')) {
          // A comment goes until the end of the line.                
          while (this.peek() !== '\n' && !this.isAtEnd())
            this.advance()
        } else if (this.match('*')) {
          // Multiline comment block goes until */ is found
          let err = false
          while (this.peek() !== '*' && this.peekNext() !== '/') {
            this.advance()
            if (this.isAtEnd()) {
              err = true
              logError(this.line, '', 'Unterminated comment block.')
              break
            }
          }
          if (!err) {
            this.advance() // skip * char
            this.advance() // skip / char
          }
        } else {
          this.addToken(TokenType.SLASH)
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
        if (this.isDigit(c)) {
          this.number()
        } else if (this.isAlpha(c)) {
          this.identifier()
        } else {
          logError(this.line, '', `Unexpected character: ${c}`)
        }
        break
    }
  }

  peek() {
    if (this.isAtEnd())
      return '\0'
    return this.source.charAt(this.current)
  }

  peekNext() {
    if (this.current + 1 >= this.source.length)
      return '\0'
    return this.source.charAt(this.current + 1)
  }

  match(expected) {
    if (this.isAtEnd() || this.source.charAt(this.current) !== expected) 
      return false

    this.current++
    return true
  }
  
  advance() {                               
      this.current++
      return this.source.charAt(this.current - 1)
   }

  addToken(type) {
    this.addToken(type, null)
  }

  addToken(type, literal) {
    const text = this.source.substring(this.start, this.current)
    this.tokens.push(new Token(type, text, literal, this.line))
  }

  isAtEnd() {
    return this.current >= this.source.length
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      if (this.peek() == '\n') 
        this.line++
      
      this.advance()
    }
    // Unterminated string.
    if (this.isAtEnd()) {
      logError(this.line, '', 'Unterminated string.')
      return
    }

    // The closing ".
    this.advance()

    // Fetch character sequence between quotes
    const value = this.source.substring(this.start + 1, this.current - 1)
    this.addToken(TokenType.STRING, value)
  }

  number() {
    while (this.isDigit(this.peek()))
      this.advance()

    // Look for fractional part.
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance()

      while (this.isDigit(this.peek()))
        this.advance()
    }

    const strNum = this.source.substring(this.start, this.current)
    this.addToken(TokenType.NUMBER, parseFloat(strNum))
  }

  identifier() {
    while (this.isAlphaNumberic(this.peek())) 
      this.advance()

    const text = this.source.substring(this.start, this.current)
    let type = Keywords[text]
    if (type == null)
      type = TokenType.IDENTIFIER

    this.addToken(type)
  }

  isAlpha(c) {
    return  (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') ||
            (c === '_')
  }

  isDigit(c) {
    return c >= '0' && c <= '9'
  }

  isAlphaNumberic(c) {
    return this.isAlpha(c) || this.isDigit(c)
  }
}

module.exports = Scanner