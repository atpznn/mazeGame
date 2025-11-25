export function createMap(input: string) {
    const map = input.split('\n').filter(x => x != '').map(row => {
        return row.split(']').filter(x => x != '').map(cell => cell.replace('[', ''))
    })
    return map
}
function findStart(state: string[][]) {
    console.log(state)
    return state.reduce((position, row, indexRow) => {
        return row.reduce((_position, cell, indexcell) => {
            if (cell == 's') return [indexRow, indexcell]
            return _position
        }, position)
    }, [0, 0] as [number, number])
}
export function initDiscovered(state: string[][]) {
    const playerPostion = findStart(state)
    console.log(playerPostion)
    const discovered = [playerPostion]
    const nextMoveDown = nextMove(playerPostion, 'v')
    const nextMoveUp = nextMove(playerPostion, '^')
    const nextMoveLeft = nextMove(playerPostion, '<')
    const nextMoveRight = nextMove(playerPostion, '>')
    if (!isNextMoveOutBound(state, nextMoveDown)) { discovered.push(nextMoveDown) }
    if (!isNextMoveOutBound(state, nextMoveUp)) { discovered.push(nextMoveUp) }
    if (!isNextMoveOutBound(state, nextMoveLeft)) { discovered.push(nextMoveLeft) }
    if (!isNextMoveOutBound(state, nextMoveRight)) { discovered.push(nextMoveRight) }
    return discovered
}

export function renderMap(state: string[][], currentDir: string, discovered: [number, number][]) {
    return state.reduce((renderString, row, indexRow) => {
        return row.reduce((_renderString, cell, indexCell) => {
            if (cell == 's')
                return _renderString + `${currentDir}`
            if (discovered.some(s => s[0] == indexRow && s[1] == indexCell)) {
                return _renderString + `${cell}`
            }
            return _renderString + `?`
        }, renderString) + '\n'
    }, "")
}


function isNextMoveOutBound(state: string[][], position: [number, number]): boolean {
    if (position[0] > state[0].length || position[0] < 0) return true
    if (position[1] > state.length || position[1] < 0) return true
    return false
}

export function isNextMoveNotWall(nextMove: string) { return nextMove != 'x' }

export function isGoal(moved: string) { return moved == 'o' }

export function walk(state: string[][], dir: string): [boolean, string[][]] {
    const positionPlayer = findStart(state)
    const nextPosition = nextMove(positionPlayer, dir)
    if (isNextMoveOutBound(state, nextPosition)) return [false, state]
    const moved = state[nextPosition[0]][nextPosition[1]]
    if (isNextMoveNotWall(moved)) {
        state[nextPosition[0]][nextPosition[1]] = 's'
        const finish = isGoal(moved)
        state[positionPlayer[0]][positionPlayer[1]] = "_"
        return [finish, state]
    }
    return [false, state]
}

export function discoverAround(state: string[][], discovered: [number, number][]) {
    return initDiscovered(state).reduce((existDiscovered, newDiscovered) => {
        if (existDiscovered.every(s => s != newDiscovered))
            existDiscovered.push(newDiscovered)
        return existDiscovered
    }, discovered)
}

export function turnLeft(dir) {
    if (dir == '>') return "^"
    if (dir == '^') return '<'
    if (dir == '<') return 'v'
    if (dir == 'v') return '>'
}

function nextMove(position: [number, number], dir: string): [number, number] {
    if (dir == '^') return [position[0] - 1, position[1]]
    else if (dir == '<') return [position[0], position[1] - 1]
    else if (dir == 'v') return [position[0] + 1, position[1]]
    else if (dir == '>') return [position[0], position[1] + 1]
}


export function turnRight(dir: string) {
    if (dir == '>') return "v"
    if (dir == 'v') return '<'
    if (dir == '<') return '^'
    if (dir == '^') return '>'
}



