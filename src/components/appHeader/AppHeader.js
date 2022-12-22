import './appHeader.scss';

const AppHeader = () => {
    return (
        <header className="app__header">
            <h1 className="app__title">
                <a href="marvel.com">
                    <span>Marvel</span> information portal
                </a>
            </h1>
            <nav className="app__menu">
                <ul>
                    <li><a href="marvel.com">Characters</a></li>
                    /
                    <li><a href="marvel.com">Comics</a></li>
                </ul>
            </nav>
        </header>
    )
}

export default AppHeader;