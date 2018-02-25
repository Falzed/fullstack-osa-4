const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    let summa = 0
    blogs.forEach(blog => {
        summa += blog.likes
    })
    return summa
}

const favoriteBlog = (blogs) => {
    let suurinTykkaysMaara = 0
    let suosituinBlogi = null
    blogs.forEach(blog => {
        if (blog.likes > suurinTykkaysMaara) {
            suurinTykkaysMaara = blog.likes
            suosituinBlogi = blog
        }
    })
    if (suosituinBlogi === null) {
        return null
    }
    return {
        title: suosituinBlogi.title,
        author: suosituinBlogi.author,
        likes: suosituinBlogi.likes
    }
}

const mostBlogs = (blogs) => {
    const authorsDictionary = {}
    let suurinBlogiMaara = 0
    let mahtavinBlogaaja = null
    blogs.forEach(blog => {
        if (authorsDictionary[blog.author] === undefined) {
            authorsDictionary[blog.author] = 1
        } else {
            authorsDictionary[blog.author] = authorsDictionary[blog.author] + 1
        }
        if (authorsDictionary[blog.author] > suurinBlogiMaara) {
            suurinBlogiMaara = authorsDictionary[blog.author]
            mahtavinBlogaaja = blog.author
        }
    })
    return mahtavinBlogaaja
}

const mostLikes = (blogs) => {
    const authorsDictionary = {}
    let suurinTykkaysMaara = 0
    let mahtavinBlogaaja = null
    blogs.forEach(blog => {
        if (authorsDictionary[blog.author] === undefined) {
            authorsDictionary[blog.author] = blog.likes
        } else {
            authorsDictionary[blog.author] = authorsDictionary[blog.author]
                + blog.likes
        }
        if (authorsDictionary[blog.author] > suurinTykkaysMaara) {
            suurinTykkaysMaara = authorsDictionary[blog.author]
            mahtavinBlogaaja = blog.author
        }
    })
    return mahtavinBlogaaja
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}